$root = $PSScriptRoot
$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Serving $root on http://localhost:$port/"
Write-Host "Live editing enabled - use the Edit button in the site, bottom-right."

$mime = @{
  ".html" = "text/html"; ".css" = "text/css"; ".js" = "application/javascript";
  ".svg" = "image/svg+xml"; ".png" = "image/png"; ".jpg" = "image/jpeg"; ".jpeg" = "image/jpeg";
  ".ico" = "image/x-icon"; ".json" = "application/json"
}

$rootFull = [System.IO.Path]::GetFullPath($root)

while ($listener.IsListening) {
  $context = $listener.GetContext()
  $req = $context.Request
  $res = $context.Response
  $path = $req.Url.LocalPath

  if ($req.HttpMethod -eq "POST" -and $path -eq "/__save") {
    try {
      $relPath = $req.QueryString["path"]
      if (-not $relPath) { $relPath = "index.html" }
      $relPath = [System.Uri]::UnescapeDataString($relPath).TrimStart("/")
      $target = [System.IO.Path]::GetFullPath((Join-Path $root $relPath))

      if (-not $target.StartsWith($rootFull, [System.StringComparison]::OrdinalIgnoreCase)) {
        $res.StatusCode = 403
        $msg = [System.Text.Encoding]::UTF8.GetBytes("Forbidden path")
        $res.OutputStream.Write($msg, 0, $msg.Length)
      } else {
        $reader = New-Object System.IO.StreamReader($req.InputStream, [System.Text.Encoding]::UTF8)
        $body = $reader.ReadToEnd()
        $reader.Close()

        if (Test-Path $target -PathType Leaf) {
          $backupDir = Join-Path $root ".edit-backups"
          if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir | Out-Null }
          $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
          $safeName = ($relPath -replace '[\\/]', '_') + ".$stamp.bak"
          Copy-Item $target (Join-Path $backupDir $safeName) -Force
        }

        [System.IO.File]::WriteAllText($target, $body, (New-Object System.Text.UTF8Encoding($false)))
        Write-Host "Saved edit -> $relPath"
        $res.StatusCode = 200
        $res.ContentType = "text/plain"
        $msg = [System.Text.Encoding]::UTF8.GetBytes("OK")
        $res.OutputStream.Write($msg, 0, $msg.Length)
      }
    } catch {
      $res.StatusCode = 500
      $msg = [System.Text.Encoding]::UTF8.GetBytes("Save failed: $($_.Exception.Message)")
      $res.OutputStream.Write($msg, 0, $msg.Length)
    }
    $res.OutputStream.Close()
    continue
  }

  if ($path -eq "/") { $path = "/index.html" }
  $filePath = Join-Path $root ($path.TrimStart("/"))
  if (Test-Path $filePath -PathType Leaf) {
    $ext = [System.IO.Path]::GetExtension($filePath)
    $contentType = $mime[$ext]
    if (-not $contentType) { $contentType = "application/octet-stream" }
    $bytes = [System.IO.File]::ReadAllBytes($filePath)
    $res.ContentType = $contentType
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $res.StatusCode = 404
    $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
    $res.OutputStream.Write($msg, 0, $msg.Length)
  }
  $res.OutputStream.Close()
}
