
# Windows Server - Active Directory

## Bruger administration

### Forlæng udløb af kode
Find bruger og derefter gå under  
`Account > Account Options > "User must change password at next logon" > Slå på > Slå fra`  
Herefter skulle expire gerne være nulstillet

*Det kan være en idé at verificere om det virker*

### Tjek hvornår koden udløber


Sæt ind i pwsh
```powershell
$Username = Read-Host -Prompt "Angiv brugernavn"
Get-ADUser -Identity $Username -Properties "msDS-UserPasswordExpiryTimeComputed" | 
Select-Object Name, @{Name="PasswordExpires"; Expression={[datetime]::FromFileTime($_."msDS-UserPasswordExpiryTimeComputed")}}
```

### Find password udløbs politik
Sæt ind i pwsh
```powershell
"MaxPasswordAge: $((Get-ADDefaultDomainPasswordPolicy).MaxPasswordAge.Days) days"
```