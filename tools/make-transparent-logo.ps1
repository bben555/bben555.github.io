Add-Type -AssemblyName System.Drawing

$root = Split-Path $PSScriptRoot -Parent
$srcPath = Join-Path $root "images\logo.png"
$outLogo = Join-Path $root "images\logo-transparent.png"
$outFavicon = Join-Path $root "images\favicon-lotus.png"

$src = New-Object System.Drawing.Bitmap($srcPath)
$w = $src.Width
$h = $src.Height

# Step 1: build a transparent version — near-white pixels become transparent,
# with a soft falloff near the threshold so edges anti-alias instead of banding.
$transparent = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$whiteFloor = 235   # pixels with min channel >= this are fully transparent
$whiteCeil  = 250   # pixels with min channel >= this are fully transparent (opaque below whiteFloor)

for ($y = 0; $y -lt $h; $y++) {
  for ($x = 0; $x -lt $w; $x++) {
    $p = $src.GetPixel($x, $y)
    $minc = [Math]::Min($p.R, [Math]::Min($p.G, $p.B))
    if ($minc -ge $whiteCeil) {
      $a = 0
    } elseif ($minc -le $whiteFloor) {
      $a = $p.A
    } else {
      $t = ($minc - $whiteFloor) / [double]($whiteCeil - $whiteFloor)
      $a = [int]([Math]::Round($p.A * (1 - $t)))
    }
    if ($a -gt 0) {
      $transparent.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($a, $p.R, $p.G, $p.B))
    } else {
      $transparent.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
    }
  }
}

$transparent.Save($outLogo, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved transparent full logo -> $outLogo"

# Step 2: find the lotus-only crop box.
# Scan row-by-row (top 70% of image, where the mark lives) for rows containing
# any non-transparent pixel, to find the mark's vertical extent; then find the
# first fully-empty gap row after the mark starts, which separates it from the wordmark.
function RowHasInk($bmp, $y, $w) {
  for ($x = 0; $x -lt $w; $x++) {
    if ($bmp.GetPixel($x, $y).A -gt 10) { return $true }
  }
  return $false
}

$scanLimit = [int]($h * 0.75)
$firstInk = -1
$lastInkBeforeGap = -1
$gapStart = -1

for ($y = 0; $y -lt $scanLimit; $y++) {
  $hasInk = RowHasInk $transparent $y $w
  if ($hasInk -and $firstInk -eq -1) { $firstInk = $y }
  if ($firstInk -ne -1 -and -not $hasInk -and $gapStart -eq -1) {
    # candidate gap — confirm it stays empty for a few rows (real gap, not a thin notch)
    $confirmedGap = $true
    for ($g = $y; $g -lt [Math]::Min($y + 8, $scanLimit); $g++) {
      if (RowHasInk $transparent $g $w) { $confirmedGap = $false; break }
    }
    if ($confirmedGap) { $gapStart = $y }
  }
}

if ($gapStart -eq -1) { $gapStart = $scanLimit }
$markBottom = $gapStart - 1

# Now find horizontal extent within [firstInk, markBottom]
$minX = $w; $maxX = -1
for ($y = $firstInk; $y -le $markBottom; $y++) {
  for ($x = 0; $x -lt $w; $x++) {
    if ($transparent.GetPixel($x, $y).A -gt 10) {
      if ($x -lt $minX) { $minX = $x }
      if ($x -gt $maxX) { $maxX = $x }
    }
  }
}

$pad = 6
$cropX = [Math]::Max(0, $minX - $pad)
$cropY = [Math]::Max(0, $firstInk - $pad)
$cropW = [Math]::Min($w - $cropX, ($maxX - $minX + 1) + $pad * 2)
$cropH = [Math]::Min($h - $cropY, ($markBottom - $firstInk + 1) + $pad * 2)

Write-Host "Detected lotus box: x=$cropX y=$cropY w=$cropW h=$cropH (firstInk=$firstInk markBottom=$markBottom)"

$rect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
$lotus = $transparent.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$lotus.Save($outFavicon, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved cropped transparent lotus -> $outFavicon"

$src.Dispose()
$transparent.Dispose()
$lotus.Dispose()
