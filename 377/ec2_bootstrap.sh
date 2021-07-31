#!/bin/bash
sudo bash -c 'echo -e "[nimble]\nname= Nimble Streamer repository\nbaseurl=http://nimblestreamer.com/centos/7/\$basearch\nenabled=1\ngpgcheck=1\ngpgkey=http://nimblestreamer.com/gpg.key\n" > /etc/yum.repos.d/nimble.repo'
sudo yum -y makecache
sudo yum -y install nimble
sudo service nimble start