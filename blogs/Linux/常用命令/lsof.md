# lsof

  -?|-h list help          -a AND selections (OR)     -b avoid kernel blocks
  -c c  cmd c ^c /c/[bix]  +c w  COMMAND width (9)    +d s  dir s files
  -d s  select by FD set   +D D  dir D tree *SLOW?*   +|-e s  exempt s *RISKY*
  -i select IPv[46] files  -K list tasKs (threads)    -l list UID numbers
  -n no host names         -N select NFS files        -o list file offset
  -O no overhead *RISKY*   -P no port names           -R list paRent PID
  -s list file size        -t terse listing           -T disable TCP/TPI info
  -U select Unix socket    -v list version info       -V verbose search
  +|-w  Warnings (+)       -X skip TCP&UDP* files     -Z Z  context [Z]
  -- end option scan     
  -E display endpoint info              +E display endpoint info and files
  +f|-f  +filesystem or -file names     +|-f[gG] flaGs 
  -F [f] select fields; -F? for help  
  +|-L [l] list (+) suppress (-) link counts < l (0 = all; default = 0)
                                        +m [m] use|create mount supplement
  +|-M   portMap registration (-)       -o o   o 0t offset digits (8)
  -p s   exclude(^)|select PIDs         -S [t] t second stat timeout (15)
  -T qs TCP/TPI Q,St (s) info
  -g [s] exclude(^)|select and print process group IDs
  -i i   select by IPv[46] address: [46][proto][@host|addr][:svc_list|port_list]
  +|-r [t[m<fmt>]] repeat every t seconds (15);  + until no files, - forever.
       An optional suffix to t is m<fmt>; m must separate t from <fmt> and
      <fmt> is an strftime(3) format for the marker line.
  -s p:s  exclude(^)|select protocol (p = TCP|UDP) states by name(s).
  -u s   exclude(^)|select login|UID set s
  -x [fl] cross over +d|+D File systems or symbolic Links