#!/bin/bash
sudo yum -y install httpd
sudo yum -y install mod_ssl
sudo mkdir /etc/ssl/private
sudo chmod 700 /etc/ssl/private
openssl req -new -newkey rsa:4096 -days 0 -nodes -x509 -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=www.example.com" -keyout /etc/ssl/private/streamer.key  -out /etc/ssl/private/streamer.cert

sudo bash -c 'echo -e "[nimble]\nname= Nimble Streamer repository\nbaseurl=http://nimblestreamer.com/centos/7/\$basearch\nenabled=1\ngpgcheck=1\ngpgkey=http://nimblestreamer.com/gpg.key\n" > /etc/yum.repos.d/nimble.repo'
sudo yum -y makecache
sudo yum -y install nimble
sudo yum -y install wget
sudo wget https://raw.githubusercontent.com/scunning1987/aws_projects/main/377/ec2_stream_builder.py
sudo python ~/ec2_stream_builder.py 40 20001
sudo echo "ssl_port = 443" >> /etc/nimble/nimble.conf
sudo echo "ssl_certificate = /etc/ssl/private/streamer.cert" >> /etc/nimble/nimble.conf
sudo echo "ssl_certificate_key = /etc/ssl/private/streamer.key" >> /etc/nimble/nimble.conf
sudo echo "ssl_protocols = TLSv1 TLSv1.1 TLSv1.2" >> /etc/nimble/nimble.conf
sudo service nimble start