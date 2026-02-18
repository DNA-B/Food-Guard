<h1 align=center> Food Guard </h1>
<div align=center>
  <img src="public/images/icon.jpg" height="400">
</div>

<br><br><br>

<div align = center>
  <img src="https://img.shields.io/badge/frontend-%23121011?style=for-the-badge"><img src="https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=white">
  <img src="https://img.shields.io/badge/language-%23121011?style=for-the-badge"><img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white"><br>
  <img src="https://img.shields.io/badge/backend-%23121011?style=for-the-badge"><img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white">
  <img src="https://img.shields.io/badge/language-%23121011?style=for-the-badge"><img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white"><br>
  <img src="https://img.shields.io/badge/dataBase-%23121011?style=for-the-badge"><img src="https://img.shields.io/badge/mongo DB-47A2485F4?style=for-the-badge&logo=mongodb&logoColor=white">
  <img src="https://img.shields.io/badge/ODM-%23121011?style=for-the-badge"><img src="https://img.shields.io/badge/mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white"><br>
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
    유통기한이 지나기 전에 냉장고에 넣어둔 음식을 다른 사람들에게 나누어보세요.
  </div>

<br><br><br>

<h1 align="center">💾 ERD 💾</h1>
  <div align="center">

```mermaid
    erDiagram
        USERS {
            ObjectId _id
            string username
            string password
            string nickname
            date createdAt
            date updatedAt
        }

        FOODS {
            ObjectId _id
            string name
            string description
            date expiryAt
            bool isConsumed
            bool isDonated
            ObjectId user
            date createdAt
            date updatedAt
        }

        DONATIONS {
            ObjectId _id
            string title
            string content
            ObjectId author
            ObjectId food
            date createdAt
            date updatedAt
        }

        CHATROOMS {
            ObjectId _id
            ObjectId donation
            bool isClosed
            ObjectId[] users
            date createdAt
            date updatedAt
        }

        CHATS {
            ObjectId _id
            ObjectId chatRoom
            ObjectId sender
            string content
            date createdAt
            date updatedAt
        }

        POSTS {
            ObjectId _id
            ObjectId author
            string title
            string content
            date createdAt
            date updatedAt
        }

        COMMENTS {
            ObjectId _id
            ObjectId author
            ObjectId post
            ObjectId parentComment
            string content
            string status
            date createdAt
            date updatedAt
        }

        GROUPS {
            ObjectId _id
            string name
            string description
            ObjectId manager
            ObjectId[] users
            date createdAt
            date updatedAt
        }

        INVITES {
            ObjectId _id
            ObjectId group
            ObjectId sender
            ObjectId recipient
            string status
            date createdAt
            date updatedAt
        }

        USERS ||--o{ FOODS : owns
        USERS ||--o{ DONATIONS : writes
        FOODS ||--|| DONATIONS : donated_as
        DONATIONS ||--|| CHATROOMS : opens
        CHATROOMS ||--o{ CHATS : has
        USERS ||--o{ CHATS : sends

        USERS ||--o{ POSTS : writes
        POSTS ||--o{ COMMENTS : has
        USERS ||--o{ COMMENTS : writes
        COMMENTS ||--o{ COMMENTS : replies_to

        USERS ||--o{ GROUPS : joins
        USERS ||--|| GROUPS : manages
        GROUPS ||--o{ INVITES : has
        USERS ||--o{ INVITES : sends
        USERS ||--o{ INVITES : receives
```

  </div>

<br><br><br>

<h1 align="center">👀 Preview 👀</h1>
  <br>
  <div align="center">
  <b><i>공사중
    <div>
      <h3>메인페이지 ~ 로그인/로그아웃</h3>
        <img src="public/videos/메인-로그인_로그아웃.gif">
    </div>
    <div>
      <h3>음식</h3>
        <img src="public/videos/음식.gif">
    </div>
    <div>
      <h3>그룹</h3>
      <div>
        <h4>생성/그룹원 목록/그룹 수정</h4>
          <img src="public/videos/그룹(생성_목록_수정).gif">
      </div>
      <div>
        <h4>그룹 초대 수락/그룹 음식 생성/그룹 나가기</h4>
          <img src="public/videos/그룹(초대_음식생성_나가기).gif">
      </div>
      <div>
        <h4>다른 그룹원의 음식 먹기</h4>
          <img src="public/videos/그룹(내가먹을게요).gif">
      </div>
    </div>
    <div>
      <h3>커뮤니티</h3>
        <img src="public/videos/커뮤니티.gif">
    </div>
    <div>
      <h3>나눔</h3>
        <img src="public/videos/나눔.gif">
    </div>
  </div>

<br><br><br><hr>

### Project Timeline

- `2025.02` ~ `2025.06`
  - **MVP** (기본적인 데이터 생성·조회·수정·삭제 기능 중심의 서비스 기반 구축)
- `2025.10` ~ `2025-02`
  - **Advanced Features & Refactoring** (Socket.io 실시간 채팅 및 코드 최적화)
