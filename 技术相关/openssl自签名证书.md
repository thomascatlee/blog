---
title: openssl自签名证书
date: 2023-06-09 18:09:03 +0800
author: me
tags:
    - 
---

openssl genrsa -out server.key 2048
 
openssl req -new -key server.key -subj "/CN=10.30.0.163" -out server.csr
 
echo subjectAltName = IP:10.30.0.163 > extfile.cnf
 
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -extfile extfile.cnf -out server.crt -days 5000




openssl genrsa -aes256 -out ca-key.pem 4096
openssl req -new -x509 -days 365 -key ca-key.pem -sha256 -out ca.pem
openssl genrsa -out server-key.pem 4096
openssl req -subj "/CN=101.102.103.104" -sha256 -new -key server-key.pem -out server.csr
echo subjectAltName = DNS:101.102.103.104,IP:101.102.103.104,IP:127.0.0.1 >> extfile.cnf
openssl x509 -req -days 365 -sha256 -in server.csr -CA ca.pem -CAkey ca-key.pem -CAcreateserial -out server-cert.pem -extfile extfile.cnf


openssl genrsa -aes256 -out ca-key.pem 4096

openssl req -new -x509 -days 365 -key ca-key.pem -sha256 -out ca.pem

openssl genrsa -out server-key.pem 4096

openssl req -subj "/CN=<ip-address>" -sha256 -new -key server-key.pem -out server.csr

echo subjectAltName = IP:<ip-address> >> extfile.cnf

echo extendedKeyUsage = serverAuth >> extfile.cnf

openssl x509 -req -days 365 -sha256 -in server.csr -CA ca.pem -CAkey ca-key.pem \
  -CAcreateserial -out server-cert.pem -extfile extfile.cnf