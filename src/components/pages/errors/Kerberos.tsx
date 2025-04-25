export function Clock_Skew() {
    return (
        <>
        <h1>Bypassing Kerberos Time Verification</h1>
        {/*============Separate============*/}
        <div className="empty-3-lines"></div>  
        {/*============Separate============*/}
        <h4>Fixing the <span className="color-1">Clock Skew Too Great</span> error</h4>
        <div className="container">
            <p>
                Kerberos is a network authentication protocol that uses encrypted tickets to verify
                identities in distributed systems. One of its fundamental security measures is <strong>
                    strict time synchronization</strong> between clients and servers.
            </p>
            <p>
                Occurs when there's a time difference greater than <strong>5 minutes</strong> (by default)
                between the local clock and the Domain Controller (DC). This protection
                prevents replay attacks where an attacker might attempt to reuse old tickets.
                In compromised environments or during penetration testing, this mechanism can block
                valid <strong>TGT</strong> (Ticket Granting Ticket) acquisition, preventing access to network resources.
            </p>
        </div>  
        {/*============Separate============*/}
        <div className="empty-3-lines"></div> 
        {/*============Separate============*/}
        <h4>Solution using ntpdate</h4>
        <div className="container">
            <p>
                The <span className="color-1">ntpdate</span> command is a utility for setting and synchronizing the date and time
                of a computer system to match that of a reliable <strong>NTP</strong> (Network Time Protocol) server.
                By ensuring the system clock is accurate, ntpdate helps maintain system logs, schedule
                tasks, and ensure time-sensitive operations run effectively. Below are several use cases
                demonstrating how to effectively utilize the ntpdate command.
            </p>
            <p>
                Synchronizing a computer internal clock is crucial in maintaining synchronization across server clusters,
                databases, and logging services. When systems operate on different times, anomalies may occur, leading to
                data corruption or erroneous log entries. Using sudo ntpdate host, an administrator can ensure a computer
                clock adheres to a globally accepted time standard provided by a specific <strong>host</strong> or NTP server.
            </p>
            <div className="container container-sm container-mm">
            </div>
            <p>
                Under certain conditions, it might be necessary to enforce an instantaneous time adjustment rather than gradual
                syncing, for example avoiding time make use <strong>slewed</strong>, incorporating <strong>settimeofday</strong>.
            </p>
            {/*============Table============*/}
            <div className="container container-sm">
                <article className="expand-content-table">
                    <h6>¡Expand content!</h6>
                    <div className="container container-sm container-list">
                    </div>
                </article>
            </div>
            <p>
                In many cases de the speed of the internet play a crucial role when you try to syncronize against a Domain Controller, in very useful to have so kwoledge in automation programing
                lenguajes. For example: You can develop a little script in bash to send a multiple syncronizing request.
            </p>
            <p>You can see how work the sincronizing process:</p>
            <div className="expand-content-image">
                <h6>¡Expand content!</h6>
                <article className="cont-images">
                    <img src="/Graphs/OverloadNtpdate.png" decoding="async" alt="Image that show info much beautiful" />
                    <span className="copyright">@Vishok, owner copyright</span>
                </article>
            </div>
        </div>
        {/*============Separate============*/}
        <div className="empty-3-lines"></div> 
        {/*============Separate============*/}
        <h4>Solution using faketime</h4>          
        <div className="container">
            <p>
                The <span className="color-1">faketime</span> tool intercepts system
                time-related calls, allowing applications to be "fooled" about the current time,
                we can use this to bypass the Kerberos time verification in impacket tools against
                a Windows System Operation that running over a Domain Controller.
            </p> 
            <div className="container">            
                <p>
                    First we obtain the exact time from the Domain Controller via SMB, since
                    this protocol doesn't have the same time restrictions as Kerberos
                    and then we use faketime with the obtained time to generate our TGT.
                    This step generates a <span className="color-1">.ccache</span> file with a
                    valid Kerberos ticket, synchronized with the DC's time.
                </p>
            </div>          
            <div className="expand-content-dialog expand-content-warning-dialog">
                <h6>¡Expand content!</h6>
                <p>

                It's critical that the command executes in a single line without pipes, concatenations or xargs, as these operations would create subshells where faketime loses its effect. The system call interceptor only affects the immediate process.

                </p>
            </div>
        </div>
        {/*============Separate============*/}
        <div className="empty-3-lines"></div> 
        {/*============Separate============*/}
        <h4>Technical Deep Dive: faketime mechanics</h4>
        <div className="container">
            <p>
                <span className="color-1">Faketime</span> works by intercepting system
                calls related to time through <strong>LD_PRELOAD</strong>,
                a Linux mechanism that loads libraries before others. The LD_PRELOAD variable allows to specify paths
                to libraries which are to be loaded before any other libraries are loaded. What’s important, all the 
                symbols (e.g. functions) contained in the preloaded libraries take precedence over the symbols
                from libraries loaded afterwards.
            </p>
            <p>
                When applications like "impacket-getTGT" make system calls
                to check the current time like "time()" "gettimeofday()",
                or "clock_gettime() ", these calls are redirected to libfaketime
                instead of the standard C library.
            </p>
            <div className="expand-content-image">
                <h6>¡Expand content!</h6>
                <article className="cont-images">
                    <img src="/Graphs/KerberosSkew.png" decoding="async" alt="Image that show info much beautiful" />
                    <span className="copyright">@Vishok, owner copyright</span>
                </article>
            </div>
        </div>  
        {/*============Separate============*/}
        <div className="empty-3-lines"></div> 
        {/*============Separate============*/}
        <h4>Final configuration</h4>
        <div className="container">
            <p>
                To use the generated ticket, we export it as an environment variable 
                this tells Impacket tools where to find our Kerberos credentials. Finally 
                we execute the target command with the spoofed time:
            </p>
            
            <p>This technique is particularly useful in:</p>

            <div className="container container-list">
                <li>Environments with NTP disabled</li>
                <li>Compromised machines where changing system time would affect other processes</li>
                <li>Scenarios where we lack privileges to modify system time settings</li>
            </div>
            <p>
                The bypass enables <strong>successful authentication</strong> while maintaining
                system clock integrity for other operations.
            </p>
        </div>
        </>
    )
}