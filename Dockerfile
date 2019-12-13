FROM openjdk:11-jdk

#docker run -v /root/ndp/page-crawl/:/page-crawl/ -it openjdk:11.0.5-jre-stretch
RUN cd / \
&& curl -sL https://deb.nodesource.com/setup_12.x | bash - \
&& apt install -y nodejs chromium

WORKDIR /page-crawl/

CMD nodejs build/classes/kotlin/main/page-crawl.js