Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot -Parent
$srcPath = Join-Path $root "images\_logos\dabc.jpg"
$outPath = Join-Path $root "images\partner-dabc.png"

$src = New-Object System.Drawing.Bitmap($srcPath)
$w = $src.Width; $h = $src.Height
$out = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$whiteFloor = 232
$whiteCeil  = 248

for ($y = 0; $y -lt $h; $y++) {
  for ($x = 0; $x -lt $w; $x++) {
    $p = $src.GetPixel($x, $y)
    $minc = [Math]::Min($p.R, [Math]::Min($p.G, $p.B))
    if ($minc -ge $whiteCeil) { $a = 0 }
    elseif ($minc -le $whiteFloor) { $a = 255 }
    else { $t = ($minc - $whiteFloor) / [double]($whiteCeil - $whiteFloor); $a = [int]([Math]::Round(255 * (1 - $t))) }
    if ($a -gt 0) { $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($a, $p.R, $p.G, $p.B)) }
    else { $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0,0,0,0)) }
  }
}
$out.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved -> $outPath"
$src.Dispose(); $out.Dispose()
