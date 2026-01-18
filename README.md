<h1 align=center> Food Guard </h1>
<div align=center>
  <img src="public/images/icon-green.jpg" height="400">
</div>

<br><br><br>

<div align = center>
  <img src="https://img.shields.io/badge/frontend-%23121011?style=for-the-badge"><img src="https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=white">
  <img src="https://img.shields.io/badge/language-%23121011?style=for-the-badge"><img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white"><br>
  <img src="https://img.shields.io/badge/backend-%23121011?style=for-the-badge"><img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white">
  <img src="https://img.shields.io/badge/language-%23121011?style=for-the-badge"><img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white"><br>
  <img src="https://img.shields.io/badge/dataBase-%23121011?style=for-the-badge"><img src="https://img.shields.io/badge/mongo DB-47A2485F4?style=for-the-badge&logo=mongodb&logoColor=white"><br>
  <img src="https://img.shields.io/badge/library-%23121011?style=for-the-badge"><img src="https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white">
</div>

<br><br><br>

<h1 align="center">👋 Introduction 👋</h1>
  <div align="center">
    가족이 냉장고에 넣어놓은 음식을 먹었다가 혼나본 경험이 있으신가요? <br>
    Food Guard는 냉장고에 있는 음식이 누구의 것인지 확인할 수 있는 기능을 제공합니다.<br>
    이제 여러분은 누구의 음식인지 확인하여 가족과 싸우는 일을 피할 수 있습니다.<br><br>
    냉장고에 넣어두었다가 유통기한이 지나 음식을 버리는 경험이 있으신가요?<br>
    Food Guard는 음식을 나눔하는 기능을 제공합니다.<br>
    이제 유통기한이 지나기 전에 냉장고에 넣어둔 음식을 다른 사람들에게 나누어보세요.
  </div>

<br><br><br>

<h1 align="center">💾 ERD 💾</h1>
  <div align="center">
    
```mermaid
    erDiagram
        USERS {
            objectId _id PK
            string username
            string password
            string nickname
            date createdAt
            date updatedAt
            int __v
        }
        
        FOODS {
            objectId _id PK
            string name
            string description
            date expiryAt
            bool isConsumed
            bool isDonated
            objectId user FK
            objectId group FK
            date createdAt
            date updatedAt
            int __v
        }
        
        GROUPS {
            objectId _id PK
            string name
            string description
            objectId manager FK
            array users FK
            date createdAt
            date updatedAt
            int __v
        }
        
        DONATIONS {
            objectId _id PK
            string title
            string content
            objectId author FK
            objectId food FK
            date createdAt
            date updatedAt
            int __v
        }
        
        CHATROOMS {
            objectId _id PK
            objectId donation FK
            array users FK
            bool isClosed
            date createdAt
            date updatedAt
            int __v
        }
        
        CHATS {
            objectId _id PK
            objectId chatRoom FK
            objectId sender FK
            string content
            date createdAt
            date updatedAt
            int __v
        }
        
        INVITES {
            objectId _id PK
            objectId group FK
            objectId sender FK
            objectId recipient FK
            string status
            date createdAt
            date updatedAt
            int __v
        }
        
        POSTS {
            objectId _id PK
            string title
            string content
            objectId author FK
            date createdAt
            date updatedAt
            int __v
        }
        
        USERS ||--o{ FOODS : "owns"
        USERS ||--o{ GROUPS : "manages"
        USERS ||--o{ GROUPS : "member of"
        USERS ||--o{ DONATIONS : "creates"
        USERS ||--o{ CHATROOMS : "participates in"
        USERS ||--o{ CHATS : "sends"
        USERS ||--o{ INVITES : "sends"
        USERS ||--o{ INVITES : "receives"
        USERS ||--o{ POSTS : "authors"
        
        GROUPS ||--o{ FOODS : "contains"
        GROUPS ||--o{ INVITES : "has"
        
        FOODS ||--o| DONATIONS : "donated as"
        
        DONATIONS ||--|| CHATROOMS : "has"
        
        CHATROOMS ||--o{ CHATS : "contains"
```

  </div>

<br><br><br>

<h1 align="center">👀 Preview 👀</h1>
  <br>
  <div align="center">
  <!-- 
    <h3>음식</h3>
    <h3>그룹</h3>
    <h3>커뮤니티</h3>
    <h3>음식 나눔 - 게시글</h3>
    <h3>음식 나눔 - 채팅</h3> -->
  </div>

<br><br><br><hr>

### Project Timeline ###
- `2025.02` ~ `2025.06`
  - **MVP** (기본적인 데이터 생성·조회·수정·삭제 기능 중심의 서비스 기반 구축)
- `2025.10` ~ `2026.01`
  - **Advanced Features & Refactoring** (Socket.io 실시간 채팅 및 코드 최적화)
