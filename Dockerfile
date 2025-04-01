FROM --platform=linux/amd64 openjdk:21
LABEL authors="ropold"
EXPOSE 8080
COPY backend/target/sudokuanimalhub.jar sudokuanimalhub.jar
ENTRYPOINT ["java", "-jar", "sudokuanimalhub.jar"]