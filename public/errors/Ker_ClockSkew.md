# By vishok kerberos
# clock skew error
####
####
####
## Fixing the Clock Skew Too Great error
### Info:
Kerberos is a network authentication protocol that uses encrypted tickets to verify identities in distributed systems. One of its fundamental security measures is **strict time synchronization** between clients and servers.Occurs when there's a time difference greater than **5 minutes** [*By default*] between the local clock and the Domain Controller (DC).
####
This protection prevents **replay attacks** where an attacker might attempt to reuse old tickets. In compromised environments or during penetration testing, this mechanism can block valid TGT [*Ticket Granting Ticket*] acquisition, preventing accto network resources.
####
####
####
## Solution using ntpdate
### Ntpdate:
The `ntpdate` command is a utility for setting and synchronizing the date and time of a computer system to match that of a reliable NTP [*Network Time Protocol*] server. By ensuring the system clock is accurate, ntpdate helps maintain system logs, schedule tasks, and ensure time-sensitive operations run effectively. Below are several use cases demonstrating how to effectively utilize the ntpdate command.
####
```bash
ntpdate domain.local
```
####
Synchronizing a computer internal clock is **crucial** in maintaining synchronization across server clusters, databases, and logging services. When systems operate on different times, anomalies may occur, leading to data corruption or erroneous log entries. Using sudo ntpdate host, an administrator can ensure a computer clock adheres to a globally accepted time standard provided by a specific **host** or **server**.
####
Under certain conditions, it might be necessary to enforce an instantaneous time adjustment rather than gradual syncing, for example avoiding time make use `slewed`, incorporating `settimeofday`.
####
```perl
sudo ntpdate -b domain.local
```
####
| Ntpdate param | Description |
| ----- | ----- |
| -d | This option commands the utility to adjust time by stepping instead of slewing, facilitating an immediate jump in time settings |
####
In many cases the speed of the internet play a crucial role when you try to syncronize against a Domain Controller, in very useful to have so kwoledge in automation programing lenguajes. For example: You can develop a little script in bash to send a multiple syncronizing request:
####
```perl
for x in $(seq 1 10); do sudo npdate -d domain.local; done

```
####
<div class="img">
    <img src="/Graphs/OverloadNtpdate.png" decoding="async" loading="lazy" />
</div>

####
####
####
## Solution using faketime
### Faketime:
The **faketime** tool intercepts system time-related calls, allowing applications to be **fooled** about the current time, we can use this to bypass the Kerberos time verification in impacket tools against a Windows System Operation that running over a DC [*Domain Controller*].
####
First we obtain the exact time from the Domain Controller using `date`,  command, since this protocol doesn'thave the same time restrictions as Kerberos and then we use faketime with the obtained time togenerate our TGT. This step generates a `.ccache` file with a valid Kerberos ticket, synchronizedwith the DC's time.
####
<div class="warning">

> Is critical that the command executes in a **single line** without **pipes**, **concatenations** or **xargs** command, as these operations would create subshells where faketime loses its effect. The system call interceptor only affects the immediate process.
</div>

####
####
####
## Technical Deep Dive mechanics
### Faketime:
**Faketime** works by intercepting system calls related to time through *LD_PRELOAD*, a Linux mechanism that loads libraries before others. The *LD_PRELOAD* allows to specify paths to libraries which are to be loaded before any other libraries are loaded. important, all the  symbols contained in the preloaded libraries take precedence the symbols from libraries loaded afterwards.
####
When applications like `impacket-getTGT` make system calls to check the current time like `time()`, `gettimeofday()`, or `clock_gettime()`, these calls are redirected to libfaketime instead of the standard C library.
####
<div class="img">
    <img src="/Graphs/KerberosSkew.png" decoding="async" loading="lazy" />
</div>