export const menuItems = [
    {
        category: "Linux",
        items: [
            { 
                name: "GoodGames", 
                difficulty: "easy",
                tags: [
                    "SQL Injection",
                    "Wfuzz",
                    "Sqlmap",
                    "SSTI",
                    "Flask",
                    "Volt Dashboard",
                    "Python",
                    "Docker",
                    "Port Internal Enumeration",
                    "Jinja2",
                    "MD5",
                    "SUID"
                ], 
                description: "GoodGames is an Easy linux machine that showcases the importance of sanitising user inputs in web applications to prevent SQL injection attacks, using strong hashing algorithms in database structures to prevent the extraction and cracking of passwords from a compromised database, along with the dangers of password re-use. It also highlights the dangers of using `render_template_string` in a Python web application where user input is reflected, allowing Server Side Template Injection (SSTI) attacks. Privilege escalation involves docker hosts enumeration and shows how having admin privileges in a container and a low privilege user on the host machine can be dangerous, allowing attackers to escalate privileges to compromise the system."
            },
            { 
                name: "Bizness",
                difficulty: "easy",
                tags: [
                    "Gobuster",
                    "Wfuzz",
                    "Apache Ofbiz 18.12",
                    "RCE",
                    "Tcpdump",
                    "Netcat",
                    "Python",
                    "Java",
                    "Base64",
                    "Hexadecimal",
                    "Strings",
                    "Derby Database"
                ],
                description: "Bizness is an easy Linux machine showcasing an Apache OFBiz pre-authentication, remote code execution (RCE) foothold, classified as `[CVE-2023-49070](https://nvd.nist.gov/vuln/detail/CVE-2023-49070)`. The exploit is leveraged to obtain a shell on the box, where enumeration of the OFBiz configuration reveals a hashed password in the services Derby database. Through research and little code review, the hash is transformed into a more common format that can be cracked by industry-standard tools. The obtained password is used to log into the box as the root user."
            },
            { 
                name: "Paper",
                difficulty: "easy",
                tags: [
                    "HTTP",
                    "Wordpress 5.2.3",
                    "Whatweb",
                    "Wffuz",
                    "Path Directory Traversal",
                    "Rocket Chat",
                    "Poolkit"
                ],
                description: "Paper is an easy Linux machine that features an Apache server on ports 80 and 443, which are serving the HTTP and HTTPS versions of a website respectively. The website on port 80 returns a default server webpage but the HTTP response header reveals a hidden domain. This hidden domain is running a WordPress blog, whose version is vulnerable to [CVE-2019-17671](https://wpscan.com/vulnerability/3413b879-785f-4c9f-aa8a-5a4a1d5e0ba2). This vulnerability allows us to view the confidential information stored in the draft posts of the blog, which reveal another URL leading to an employee chat system. This chat system is based on Rocketchat. Reading through the chats we find that there is a bot running which can be queried for specific information. We can exploit the bot functionality to obtain the password of a user on the system. Further host enumeration reveals that the sudo version is vulnerable to [CVE-2021-3560](https://www.exploit-db.com/exploits/50011) and can be exploited to elevate to root privileges."
            },
            { 
                name: "Usage",
                difficulty: "easy",
                tags: [
                    "Wffuz",
                    "Burpsuite",
                    "SQL Injection",
                    "Sqlmap",
                    "Arbitrary File Upload",
                    "7z",
                    "@list File Format",
                    "Python",
                    "PHP"
                ],
                description: "Usage is an easy Linux machine that features a blog site vulnerable to SQL injection, which allows the administrators hashed password to be dumped and cracked. This leads to access to the admin panel, where an outdated `Laravel` module is abused to upload a PHP web shell and obtain remote code execution. On the machine, plaintext credentials stored in a file allow SSH access as another user, who can run a custom binary as `root`. The tool makes an insecure call to `7zip`, which is leveraged to read the `root` user private SSH key and fully compromise the system."
            },
            { 
                name: "Writeup",
                difficulty: "easy",
                tags: [
                    "CMS Made Simple 2.2.9",
                    "Python",
                    "SQL Injection",
                    "Java",
                    "Hashcat",
                    "Staff Group",
                    "Pspy32",
                    "Path Hijacking",
                    "SSH Login",
                    "SUID"
                ],
                description: " Writeup is an easy difficulty Linux box with DoS protection in place to prevent brute forcing. A CMS susceptible to a SQL injection vulnerability is found, which is leveraged to gain user credentials. The user is found to be in a non-default group, which has write access to part of the PATH. A path hijacking results in escalation of privileges to root."
            },
            { 
                name: "Precious",
                difficulty: "easy",
                tags: [
                    "HTTP",
                    "Caido",
                    "PDF",
                    "Pdfkit 8.7.2",
                    "Command Injection",
                    "Ruby",
                    "python",
                    "Revshell",
                    "Tcpdump",
                    "Wget"
                ],
                description: "Precious is an Easy Difficulty Linux machine, that focuses on the `Ruby` language. It hosts a custom `Ruby` web application, using an outdated library, namely pdfkit, which is vulnerable to `CVE-2022-25765`, leading to an initial shell on the target machine. After a pivot using plaintext credentials that are found in a Gem repository `config` file, the box concludes with an insecure deserialization attack on a custom, outdated, `Ruby` script."
            },
            { 
                name: "SteamCloud",
                difficulty: "easy",
                tags: [
                    "HTTP",
                    "HTTPS",
                    "Etcd",
                    "Kubernetes",
                    "Kubectl",
                    "Kubeletctl",
                    "Nginx 1.14.2",
                    "Mount",
                    "Docker",
                    "YAML",
                    "Wfuzz"
                ],
                description: "SteamCloud is an easy difficulty machine. The port scan reveals that it has a bunch of Kubernetes specific ports open. We cannot not enumerate the Kubernetes API because it requires authentication. Now, as Kubelet allows anonymous access, we can extract a list of all the pods from the K8s cluster by enumerating the Kubelet service. Furthermore, we can get into one of the pods and obtain the keys necessary to authenticate into the Kubernetes API. We can now create and spawn a malicious pod and then use Kubectl to run commands within the pod to read the root flag."
            },
            { 
                name: "Nocturnal",
                difficulty: "easy",
                tags: [
                    "HTTP",
                    "Upload File",
                    "Caido",
                    "PHP",
                    "User enumeration",
                    "Command Injection",
                    "Url-encode",
                    "LibreOffice",
                    "Python",
                    "Directory Listing",
                    "SQlite3"
                ],
                description: "SteamCloud is an easy difficulty machine. The port scan reveals that it has a bunch of Kubernetes specific ports open. We cannot not enumerate the Kubernetes API because it requires authentication. Now, as Kubelet allows anonymous access, we can extract a list of all the pods from the K8s cluster by enumerating the Kubelet service. Furthermore, we can get into one of the pods and obtain the keys necessary to authenticate into the Kubernetes API. We can now create and spawn a malicious pod and then use Kubectl to run commands within the pod to read the root flag."
            }
        ]
    },
    {
        category: "Windows",
        items: [
            { 
                name: "Support",
                difficulty: "easy",
                tags: [
                    "Gobuster",
                ],
                description: " Support is an Easy difficulty Windows machine that features an SMB share that allows anonymous authentication. After connecting to the share, an executable file is discovered that is used to query the machines LDAP server for available users. Through reverse engineering, network analysis or emulation, the password that the binary uses to bind the LDAP server is identified and can be used to make further LDAP queries. A user called `support` is identified in the users list, and the `info` field is found to contain his password, thus allowing for a WinRM connection to the machine. Once on the machine, domain information can be gathered through `SharpHound`, and `BloodHound` reveals that the `Shared Support Accounts` group that the `support` user is a member of, has `GenericAll` privileges on the Domain Controller. A Resource Based Constrained Delegation attack is performed, and a shell as `NT Authority\\System` is received."
            },
            { 
                name: "Driver",
                difficulty: "easy",
                tags: [
                    "HTTP",
                    "SCF File",
                    "Printer",
                    "SMB",
                    "Impacket-smbserver",
                    "Responder",
                    "Evil-winrm",
                    "John The Ripper",
                    "Impacket-rpcdump",
                    "Rlwrap",
                    "PrintNightmare",
                    "Msfvenom",
                    "DLL",
                ],
                description: "Driver is an easy Windows machine that focuses on printer exploitation. Enumeration of the machine reveals that a web server is listening on port 80, along with SMB on port 445 and WinRM on port 5985. Navigation to the website reveals that it's protected using basic HTTP authentication. While trying common credentials the `admin:admin` credential is accepted and we are able to visit the webpage. The webpage provides a feature to upload printer firmwares on an SMB share for a remote team to test and verify. Uploading a Shell Command File that contains a command to fetch a remote file from our local machine, leads to the NTLM hash of the user `tony` relayed back to us. Cracking the captured hash to retrieve a plaintext password we are able login as `tony`, using WinRM. Then, switching over to a meterpreter session it is discovered that the machine is vulnerable to a local privilege exploit that abuses a specific printer driver that is present on the remote machine. Using the exploit we can get a session as `NT AUTHORITY\\SYSTEM`."
            },
            { 
                name: "EscapeTwo",
                difficulty: "easy",
                tags: [
                    "Evil-winrm",
                    "SMB",
                    "Netexec",
                    "Smbclient",
                    "Xls File",
                    "Xlsx File",
                    "LibreOffice",
                    "Unzip",
                    "Xmllint",
                    "Awk",
                    "Python",
                    "MSSQL Client",
                    "Xp_cmdshell",
                    "Impacket-mssqlclient",
                    "Impacket-owneredit",
                    "Impacket-dacledit",
                    "Faketime",
                    "KRB5CCNAME",
                    "Ntpdate",
                    "Certipy",
                    "Certify",
                    "ESC4",
                    "DunderMifflinAuthentication",
                ],
                description: "Active machine, the active machine no posses information about it. That informations is only available when Hackthebox retired this machine."
            }
        ]
    },
    {
        category: "Errors",
        items: [
            { 
                name: "Kerberos Clock Skew Too Great",
                difficulty: "",
                tags: [
                    "Ntpdate",
                    "Faketime",
                    "Kerberos",
                    "KRB5CCNAME",
                    "Bash",
                    "TGT",
                    "Impacket-getST",
                    "Impacket-smbexec",
                ],
                description: ""
            }
        ]
    }
]