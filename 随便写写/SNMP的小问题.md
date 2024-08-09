---
title: SNMP的小问题
date: 2024-07-17 17:44:54 +0800
author: wildcat
tags:
---
十几年前搞过SNMP，当时也没完完整整的研究过，就依葫芦画瓢的，写了，编过了，跑了，能用，完事。
最近同事遇到一个SNMP的问题，废了一些功夫才搞明白。
同事写代码用了SNMP的table，或者应该叫表量（Columnar Objects），net-snmp生成的OID中始终会多个1，看了net-snmp的代码也没找到原因。
后来查了MIB的语法：

```
(tablename) OBJECT-TYPE 
	SYNTAX SEQUENCE OF (tabletype) 
	ACCESS not-accessible
	STATUS  mandatory 
	DESCRIPTION (description)
	::= { (parent) (number) } 
 
(entryname) OBJECT-TYPE 
	SYNTAX (tabletype) 
	ACCESS not-accessible 
	STATUS  mandatory 
	DESCRIPTION (description) 
	::= { (tablename) 1 }  
 
(tabletype) ::= SEQUENCE { 
	(column1) (column1type),
	(column2) (column2type),
	(columnN) (columnNtype) 
}
```
在使用table的时候，table下会多一级entry，entry下面才是各个column，这个entry `::= { (tablename) 1 }`  就是1的来由。
至于为啥要这样，得去琢磨[RFC1212]([ietf.org/rfc/rfc1212.txt](https://www.ietf.org/rfc/rfc1212.txt))了。
