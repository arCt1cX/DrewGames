# PowerShell script to rename map image files to lowercase
$mapImagesDir = "D:\GitHubDesktop\repository\sitogiochi\guessthepic\img\maps"
$files = Get-ChildItem -Path $mapImagesDir -File

foreach ($file in $files) {
    $newName = $file.Name.ToLower()
    if ($file.Name -ne $newName) {
        $oldPath = $file.FullName
        $newPath = Join-Path -Path $file.DirectoryName -ChildPath $newName
        
        Write-Host "Renaming $($file.Name) to $newName"
        Rename-Item -Path $oldPath -NewName $newName -Force
    }
}

Write-Host "All files renamed successfully!" 