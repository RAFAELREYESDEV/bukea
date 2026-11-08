param(
    [int]$Port = 3001
)

$root = $PSScriptRoot
if (-not $root) {
    $root = (Get-Location).Path
}

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

function Get-MimeType($ext) {
    switch ($ext) {
        ".html"  { return "text/html; charset=utf-8" }
        ".htm"   { return "text/html; charset=utf-8" }
        ".css"   { return "text/css; charset=utf-8" }
        ".js"    { return "application/javascript; charset=utf-8" }
        ".json"  { return "application/json; charset=utf-8" }
        ".png"   { return "image/png" }
        ".jpg"   { return "image/jpeg" }
        ".jpeg"  { return "image/jpeg" }
        ".svg"   { return "image/svg+xml" }
        ".ico"   { return "image/x-icon" }
        ".webp"  { return "image/webp" }
        ".woff2" { return "font/woff2" }
        ".woff"  { return "font/woff" }
        ".glb"   { return "model/gltf-binary" }
        ".gltf"  { return "model/gltf+json" }
        default  { return "application/octet-stream" }
    }
}

try {
    $listener.Start()
    Write-Output "=================================================="
    Write-Output "🚀 Servidor & Router Bukea corriendo en:"
    Write-Output "👉 http://localhost:$Port/"
    Write-Output "👉 Landing:  http://localhost:$Port/"
    Write-Output "👉 Lugares:  http://localhost:$Port/lugares"
    Write-Output "👉 Login:    http://localhost:$Port/login"
    Write-Output "👉 Checkout: http://localhost:$Port/checkout"
    Write-Output "👉 Pases:    http://localhost:$Port/pases"
    Write-Output "=================================================="

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        try {
            $rawPath = $request.Url.LocalPath.TrimStart('/')
            $cleanRoute = $rawPath.ToLower().TrimEnd('/')
            $filePath = $null

            # Router de URLs amigables
            switch ($cleanRoute) {
                ""           { $filePath = [System.IO.Path]::Combine($root, "index.html") }
                "vip"        { $filePath = [System.IO.Path]::Combine($root, "proyecto_web", "index.html") }
                "login"      { $filePath = [System.IO.Path]::Combine($root, "proyecto_web", "index.html") }
                "registro"   { $filePath = [System.IO.Path]::Combine($root, "proyecto_web", "index.html") }
                "lugares"    { $filePath = [System.IO.Path]::Combine($root, "proyecto_web", "lugares.html") }
                "checkout"   { $filePath = [System.IO.Path]::Combine($root, "proyecto_web", "checkout_stepper.html") }
                "escudo"     { $filePath = [System.IO.Path]::Combine($root, "proyecto_web", "checkout_stepper.html") }
                "pases"      { $filePath = [System.IO.Path]::Combine($root, "proyecto_web", "mis_pases.html") }
                "mis-pases"  { $filePath = [System.IO.Path]::Combine($root, "proyecto_web", "mis_pases.html") }
                "admin"      { $filePath = [System.IO.Path]::Combine($root, "proyecto_web", "inicio.html") }
                "openresto"  { $filePath = [System.IO.Path]::Combine($root, "openresto_preview.html") }
                default {
                    $urlPath = [System.Uri]::UnescapeDataString($rawPath)
                    $resolved = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($root, $urlPath))
                    if ($resolved.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
                        if (Test-Path $resolved -PathType Container) {
                            $filePath = [System.IO.Path]::Combine($resolved, "index.html")
                        } elseif (Test-Path $resolved -PathType Leaf) {
                            $filePath = $resolved
                        } elseif (Test-Path ($resolved + ".html") -PathType Leaf) {
                            $filePath = $resolved + ".html"
                        }
                    }
                }
            }

            if ($filePath -and (Test-Path $filePath -PathType Leaf)) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentType = Get-MimeType $ext
                $response.ContentLength64 = $bytes.Length
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 404
                $err = [System.Text.Encoding]::UTF8.GetBytes("<!DOCTYPE html><html><body style='font-family:sans-serif;padding:2rem'><h1>404 Ruta no encontrada</h1><p>Ruta solicitada: $rawPath</p><a href='/'>Ir al Inicio</a></body></html>")
                $response.ContentType = "text/html; charset=utf-8"
                $response.ContentLength64 = $err.Length
                $response.OutputStream.Write($err, 0, $err.Length)
            }
        } catch {
            # Ignorar excepciones de clientes desconectados
        } finally {
            $response.Close()
        }
    }
} finally {
    $listener.Stop()
}
