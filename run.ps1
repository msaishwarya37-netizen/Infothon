sudo apt update

sudo apt install apt-transport-https ca-certificates curl software-properties-common -y

sudo apt install docker.io -y

sudo systemctl start docker

sudo systemctl enable docker

docker --version

sudo docker run hello-world

mkdir python-app

cd python-app

nano app.py

nano requirements.txt

nano Dockerfile

ls

docker build -t myfile-image .

docker images

docker run -d -p 5000:5000 --name myapp-container myfile-image

docker ps

docker rm -f myapp-container

#2
git clone <repo-url>

ls

cd docker5   # your repo name

docker build -t my-python-app3 .

docker images

docker tag my-python-app3:latest aishwaryams/my-python-app3:latest

docker login -u aishwaryams
# Enter password or token

docker push aishwaryams/my-python-app3:latest

cd ..
sudo apt update

sudo apt install openjdk-21-jdk -y

sudo rm jenkins.war

sudo rm -rf ~/.jenkins

ls

wget https://jenkins.io/war-stable/latest/jenkins.war

java -jar jenkins.war
# Open: http://localhost:8080

java -jar jenkins.war --httpPort=8086

#3
sudo apt install maven -y

mvn archetype:generate \-DgroupId=com.example.app \-DartifactId=demo-app \-DarchetypeArtifactId=maven-archetype-quickstart \-DinteractiveMode=false

cd demo-app

ls
# pom.xml, src

nano pom.xml

nano src/main/java/com/example/app/App.java

nano src/test/java/com/example/app/AppTest.java

mvn clean install

mvn exec:java -Dexec.mainClass="com.example.app.App"
