# nexus证书
docker需要https支持，不然需要在daemon.json里配置insecure-registries，挺麻烦的。
看了一下，nexus支持https，但是需要自己做一个证书。
docker里给出了生成自签名证书的方法：
```
$ mkdir -p certs

$ openssl req \
  -newkey rsa:4096 -nodes -sha256 -keyout certs/domain.key \
  -x509 -days 365 -out certs/domain.crt
```
nexus给出了另一个生成的方法：
```
keytool -genkeypair -keystore keystore.jks -storepass password -keypass password -alias jetty -keyalg RSA -keysize 2048 -validity 5000 -dname "CN=*.${NEXUS_DOMAIN}, OU=Example, O=Sonatype, L=Unspecified, ST=Unspecified, C=US" -ext "SAN=DNS:${NEXUS_DOMAIN},IP:${NEXUS_IP_ADDRESS}" -ext "BC=ca:true"
```
生成证书后，`将keystore.jks复制到$data-dir/etc/ssl/keystore.jks`，并修改jetty的配置支持https：

```
vim $data-dir/etc/nexus.properties 
application-port-ssl=8443
nexus-args=${jetty.etc}/jetty.xml,${jetty.etc}/jetty-http.xml,${jetty.etc}/jetty-https.xml,${jetty.etc}/jetty-requestlog.xml
```

重启nexus，然后执行`keytool -printcert -sslserver ${NEXUS_DOMAIN}:${SSL_PORT} -rfc`，就能看到证书啦。

把证书内容复制下来， vim /etc/docker/certs.d/${NEXUS_DOMAIN}:${SSL_PORT}/ca.crt 粘贴进去。

