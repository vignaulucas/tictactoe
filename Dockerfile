FROM openjdk:latest

ENV JAR_FILE=target/tic_tac_toe.jar

WORKDIR /usr/app

COPY ${JAR_FILE} app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"]
