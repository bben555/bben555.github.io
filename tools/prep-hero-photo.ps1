Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot -Parent
$src = Join-Path $root "images\_hero-candidate.jpg"
$out = Join-Path $root "images\hero-photo.jpg"

$img = [System.Drawing.Image]::FromFile($src)
$maxDim = 1100
$ratio = [Math]::Min(1.0, $maxDim / [Math]::Max($img.Width, $img.Height))
$w = [int]($img.Width * $ratio); $h = [int]($img.Height * $ratio)
$bmp = New-Object System.Drawing.Bitmap($w, $h)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($img, 0, 0, $w, $h)
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters(1)
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [int64]84)
$bmp.Save($out, $encoder, $params)
Write-Host "Saved $out ($w x $h)"
$g.Dispose(); $bmp.Dispose(); $img.Dispose()
