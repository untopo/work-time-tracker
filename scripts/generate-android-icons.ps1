param(
    [string]$Source = "src-tauri/icon-source.png",
    [string]$ResDir = "android/app/src/main/res"
)

$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

function Write-ScaledPng {
    param(
        [System.Drawing.Image]$SourceImage,
        [string]$OutputPath,
        [int]$Size,
        [double]$Scale = 1.0
    )

    $bitmap = New-Object System.Drawing.Bitmap $Size, $Size
    try {
        $bitmap.SetResolution(96, 96)
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        try {
            $graphics.Clear([System.Drawing.Color]::Transparent)
            $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

            $targetSize = [Math]::Max(1, [int][Math]::Round($Size * $Scale))
            $offset = [int][Math]::Floor(($Size - $targetSize) / 2)
            $rect = New-Object System.Drawing.Rectangle $offset, $offset, $targetSize, $targetSize
            $graphics.DrawImage($SourceImage, $rect)
        } finally {
            $graphics.Dispose()
        }

        $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    } finally {
        $bitmap.Dispose()
    }
}

$resolvedSource = Resolve-Path $Source
$resolvedResDir = Resolve-Path $ResDir
$sourceImage = [System.Drawing.Image]::FromFile($resolvedSource)

try {
    $densities = @{
        "mipmap-mdpi" = 48
        "mipmap-hdpi" = 72
        "mipmap-xhdpi" = 96
        "mipmap-xxhdpi" = 144
        "mipmap-xxxhdpi" = 192
    }

    foreach ($entry in $densities.GetEnumerator()) {
        $dir = Join-Path $resolvedResDir $entry.Key
        Write-ScaledPng -SourceImage $sourceImage -OutputPath (Join-Path $dir "ic_launcher.png") -Size $entry.Value -Scale 1.0
        Write-ScaledPng -SourceImage $sourceImage -OutputPath (Join-Path $dir "ic_launcher_round.png") -Size $entry.Value -Scale 1.0
        Write-ScaledPng -SourceImage $sourceImage -OutputPath (Join-Path $dir "ic_launcher_foreground.png") -Size $entry.Value -Scale 0.9
    }
} finally {
    $sourceImage.Dispose()
}

Write-Host "Android launcher icons regenerated from $resolvedSource"
