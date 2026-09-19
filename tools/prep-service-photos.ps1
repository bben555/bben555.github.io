Add-Type -AssemblyName System.Drawing

$root = Split-Path $PSScriptRoot -Parent
$src = Join-Path $root "images\_candidates"
$out = Join-Path $root "images"

function Resize-Save($inFile, $outFile, $maxDim, $quality) {
  $img = [System.Drawing.Image]::FromFile($inFile)
  $ratio = [Math]::Min(1.0, $maxDim / [Math]::Max($img.Width, $img.Height))
  $w = [int]($img.Width * $ratio)
  $h = [int]($img.Height * $ratio)
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($img, 0, 0, $w, $h)
  $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
  $params = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [int64]$quality)
  $bmp.Save($outFile, $encoder, $params)
  $g.Dispose(); $bmp.Dispose(); $img.Dispose()
  Write-Host "Saved $outFile ($w x $h)"
}

Resize-Save (Join-Path $src "complete-full.jpg")       (Join-Path $out "service-photo-complete.jpg")  1100 82
Resize-Save (Join-Path $src "partial-example1.jpg")    (Join-Path $out "service-photo-partial.jpg")   1100 82
Resize-Save (Join-Path $src "complete-mrm.jpg")        (Join-Path $out "service-photo-immediate.jpg") 1100 82
Resize-Save (Join-Path $src "implant-frame1.png")      (Join-Path $out "service-photo-implant.jpg")   1100 82
Resize-Save (Join-Path $src "flexible-try2.jpg")       (Join-Path $out "service-photo-flexible.jpg")  1100 82
Resize-Save (Join-Path $src "reline-try2.jpg")         (Join-Path $out "service-photo-reline.jpg")    1100 82
