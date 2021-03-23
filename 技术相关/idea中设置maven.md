# idea中设置maven

拿到一个java工程，是用eclipse写的，依赖管理用的maven；我没有eclipse了，只有jetbrain的idea，要做一些设置才可以。

![设置配置文件和repo存放目录](_v_images/20200629180505413_16087.png =762x)

maven的设置，最好用国内的repo，目前可用的大概也只有ali的了。

ali解决了大部分依赖，但是总有几个找不到，干脆配了一堆。

```
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">

    <pluginGroups />
    <proxies />
    <servers />

    <localRepository>d:/work/java/m2/repository</localRepository>
    
     <profiles>
        <profile>
        	 <id>china</id>
		  		   <repositories>
		    		   <repository>
		            <id>alimaven</id>
		            <name>aliyun maven</name>
		            <url>http://maven.aliyun.com/nexus/content/repositories/central/</url>
               </repository>     
		    		   <repository>
		            <id>sonatype</id>
		            <name>sonatype maven</name>
		            <url>https://oss.sonatype.org/content/repositories/releases/</url>
               </repository>       
           </repositories>
        </profile>
        
        <profile>
        	 <id>vpn</id>
		  		   <repositories>
		    		   <repository>
		            <id>Maven</id>
		            <name>Maven Repository Switchboard</name>
		            <url>http://repo1.maven.org/maven2/</url>
               </repository>        
      		    	<repository>
		            <id>ibiblio</id>
		            <name>Human Readable Name for this Mirror.</name>
		            <url>http://mirrors.ibiblio.org/pub/mirrors/maven2/</url>
               </repository>  
               	<repository>
		            <id>jboss-public-repository-group</id>
		            <name>JBoss Public Repository Group</name>
		            <url>http://repository.jboss.org/nexus/content/groups/public</url>
               </repository>  
		    		   <repository>
		            <id>sonatype</id>
		            <name>sonatype maven</name>
		            <url>https://oss.sonatype.org/content/repositories/releases/</url>
               </repository>                 
               	<repository>
		            <id>google-maven-central</id>
		            <name>Google Maven Central</name>
		            <url>https://maven-central.storage.googleapis.com</url>
               </repository>               
           </repositories>
        </profile>
                
    </profiles>
    
 <activeProfiles>
   <activeProfile>china</activeProfile>
 </activeProfiles>

    <mirrors>
        <mirror>
            <id>alimaven</id>
						<mirrorOf>central</mirrorOf>
            <name>aliyun maven</name>
            <url>http://maven.aliyun.com/nexus/content/repositories/central/</url>
        </mirror>
        <mirror>
            <id>central</id>
            <name>Maven Repository Switchboard</name>
            <url>http://repo1.maven.org/maven2/</url>
            <mirrorOf>central</mirrorOf>
        </mirror>
        <mirror>
            <id>repo2</id>
            <mirrorOf>central</mirrorOf>
            <name>Human Readable Name for this Mirror.</name>
            <url>http://repo2.maven.org/maven2/</url>
        </mirror>
        <mirror>
            <id>ibiblio</id>
            <mirrorOf>central</mirrorOf>
            <name>Human Readable Name for this Mirror.</name>
            <url>http://mirrors.ibiblio.org/pub/mirrors/maven2/</url>
        </mirror>
        <mirror>
            <id>google-maven-central</id>
            <name>Google Maven Central</name>
            <url>https://maven-central.storage.googleapis.com</url>
            <mirrorOf>central</mirrorOf>
        </mirror>
    </mirrors>
</settings>
```
配置了好几个repo，但慢慢捋就发现，不是repo的问题，是原工程有点年代，有一些库的版本依赖已经不在maven的能力范围了。

去[https://mvnrepository.com/](https://mvnrepository.com/)查找缺失的jar，直接下载，然后mvn手工加入：
`mvn install:install-file -Dfile=D:\download\jbarcode-0.2.8.jar -DgroupId=org.jbarcode -DartifactId=jbarcode -Dversion=0.2.8 -Dpackaging=jar -DgeneratePom=true -DcreateChecksum=true`

解决了依赖问题。然后把下载完的repo目录整个拷贝到不能上网的开发机。

idea还是比eclipse好用多了。