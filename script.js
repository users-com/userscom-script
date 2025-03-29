const reference = document
  .getElementById("userscom-chat")
  .getAttribute("data-reference");
let ticketId;
let projectDetails;
let responseData;

const BASE_URL = "http://127.0.0.1:9000";
const BASE_PATH = "localhost:9000"
/* const BASE_URL = "https://app.userscom.com"; */
/* const BASE_PATH="userscom.com" */
let IFRAME_URL = BASE_PATH+"/widget-home?iframe=active";

// const BASE_URL = "https://app.userscom.com";
let userAttributes = {};
window.userscomMessageQueue = [];
let chatIframe = null;
let isLoaded = false;
let iframeLoaded = false;

// Create form
var main_widget = document.createElement("div");
main_widget.className = "form-container";
main_widget.style.display = "none";
var iframe = document.createElement("iframe");
const sendMessageToIframe = (attributes) => {
  if (chatIframe && projectDetails?.slug) {
    const message = {
      type: "userAttributes",
      userAttributes: JSON.stringify(attributes),
      timestamp: Date.now(),
    };

    // Send message to iframe without checking route
    chatIframe.contentWindow.postMessage(
      message,
      `https://${projectDetails?.slug}.${IFRAME_URL}`
    );
    console.log("Sending message to iframe:", message);
  }
};

// Keep track of messages locally
let pendingMessages = [];

document.addEventListener("updateUserAttributes", (event) => {
  userAttributes = event.detail;
  console.log("userAttributes updated:", userAttributes);
  pendingMessages.push(userAttributes);
  sendMessageToIframe(userAttributes);
});

window.addEventListener("message", function (event) {
  if (event.data === "updateUserAttributes") {
    sendMessageToIframe(userAttributes);
  }
  if (event.data === "increaseWidth") {
    const width = "700px";
    iframe.style.width = width;
    main_widget.style.setProperty("width", width, "important");
    main_widget.style.setProperty("max-width", width, "important");

    // iframe.style.height = routeDimensions[route].height;
  }
  if (event.data === "resetWidth") {
    const width = "400px";
    iframe.style.width = width;
    main_widget.style.setProperty("width", width, "important");
    main_widget.style.setProperty("max-width", width, "important");
  }
  if (event.data === "openTicketsPage" && !isLoaded) {
    console.log("openTicketsPage...");
    IFRAME_URL = BASE_PATH+"/my-tickets?iframe=active";
    iframe.src = `http://${projectDetails?.slug}.${IFRAME_URL}`;
    
    iframe.onload = () => {
      main_widget.style.display = "block";
    };

    
    isLoaded = true;
  }
});

const userscom = {
  user: {
    set(options) {
      if (options) {
        Object.assign(this, options);
        console.log("User properties updated:", this);
        const event = new CustomEvent("updateUserAttributes", { detail: this });
        document.dispatchEvent(event);
      } else {
        console.error("No options provided");
      }
    },
  },
};

function updateButtonVisibility(img) {
  if (iframeLoaded) {
    img.style.display = "flex"; 
  } else {
    img.style.display = "none";
  }
}

// Define the custom element tag
function ChatBox() {
  const welcomeText =
    (projectDetails && projectDetails.welcome_text) || "Need Help";
  const position = (projectDetails && projectDetails.position) || "br";
  const image =
    projectDetails && projectDetails.image
      ? "https://assets.userscom.com/" + projectDetails.image
      : "https://assets.userscom.com/project_avatar.jpg";
  // Create styles
  const styles = `

input[type=radio] {
  display: none;
}
.past_tickets {
  display:none;
  background-color: white;
  border-radius: 15px;
  margin: 0px 5px 5px 5px;
  padding: 5px;
  max-height:341px;
  overflow-y:auto;
  min-height:341px;
}

.ticket-item{
  background-color: white;
  border-radius: 53px;
  margin: 10px 4px;
  position:relative;
  padding: 8px 10px;
  box-shadow: 0px 0px 8px 0px rgb(0 0 0 / 7%);
}

.tab {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 92px;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 99px;
  cursor: pointer;
  transition: color 0.15s ease-in;
}

input[type=radio] + label {
  color: #7f8fb1;
}

input[type=radio]:checked + label {
  color: rgb(51 80 142);
}


input[id=radio-1]:checked ~ .glider {
  transform: translateX(0);
}

input[id=radio-2]:checked ~ .glider {
  transform: translateX(100%);
}

.ticket_time{
  font-size:0.65rem;
  color:#767676;
}


.viewticket_button{
  font-size: 0.75rem;
  background: #dbe6ff;
  color: #33508e;
  text-align: center;
  padding: 6px 14px;
  text-decoration: none;
  transition:all 200ms ease-in;
  border-radius: 50px;
}
.viewticket_button:hover{
  background: #d1ddf7;
}

.glider {
  position: absolute;
  display: flex;
  height: 30px;
  width: 92px;
  background-color: #ffffff;
  z-index: 1;
  border-radius: 99px;
  transition: 0.25s ease-out;
}

@media (max-width: 700px) {
}



    /* Your styles go here */
    .open-button {
      background-color: #ffffffcc;
      color: rgb(71 77 113);
      padding: 7px;
      border: none;
      cursor: pointer;
      width: 35px;
      height: 35px;
      display:flex;
      justify-content:center;
      align-items:center;
      border-radius: 50%;
      backdrop-filter: blur(8px);
      box-shadow:rgb(0 0 0 / 8%) 3px 5px 14px 2px;
    }
    .open-button svg {
      width: 24px;
    }
    .userscom_body{
      position:relative;
      background: rgb(255, 255, 255);
      border-radius: 15px;
      box-shadow: rgba(100, 116, 139, 0.09) 0px 1px 13px;
      margin: 0px 5px 5px 5px;
    }
    .welcomeMsgLeft{
      position: absolute;
      bottom: 40px;
      right: 10px;
      background: rgba(255, 255, 255, 0.62);
      transform: translateX(100%);
      padding: 4px 8px 4px 8px;
      font-size: 13px;
      backdrop-filter: blur(7px);
      width: max-content;
      border-radius: 55px 55px 55px 1px;
      border: 1.5px solid rgb(0 0 0 / 11%);
    }
    .welcomeMsg {
      position: absolute;
    bottom: 40px;
    left: 0px;
    background: rgba(255, 255, 255, 0.62);
    transform: translateX(-75%);
    padding: 4px 8px 4px 8px;
    font-size: 13px;
    backdrop-filter: blur(7px);
    width: max-content;
    border-radius: 55px 55px 1px 55px;
    border:1.5px solid rgb(0 0 0 / 11%);
    }
    /* The popup chat - hidden by default */
    .chat-popup {
      align-items: end;
      display: flex;
      position: fixed;
      font-family: 'Inter', sans-serif;
      bottom: 15px;
      right: 15px;
      z-index: 9999999;
      flex-direction: column;
      row-gap:0.55rem;
    }

    .userscom_header{
      padding: 0px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    

    }
    .userscom_heading {
      font-size: 20px;
      color:rgb(51 80 142);
      font-weight: 600;
      font-family: 'Inter', sans-serif;
      letter-spacing: -0.50px;
    }
    .chat-popup-left {
      align-items: start;
      display: flex;
      position: fixed;
      font-family: 'Inter', sans-serif;
      bottom: 15px;
      left: 15px;
      z-index: 9999999;
      flex-direction: column;
      row-gap:0.55rem;
    }

    /* Add styles to the form container */
    .form-container {
      display:none;
          height: calc(100vh - 150px);
    max-height: 700px;
      max-width: 400px;
      width:370px;
      position:relative;
      border-radius:20px;
      // background:linear-gradient(36deg, rgb(177 201 255), rgb(255 255 255));
      overflow: hidden;
    position: relative;
    box-shadow:rgba(0, 0, 0, 0.16) 0px 5px 40px;
    }

    /* Change placeholder text color for both input and textarea */
    input::placeholder,
    textarea::placeholder {
      color: #94A3B8; /* Change this to the desired color */
    }

    
    /* Full-width textarea */
    textarea {
      width: 100%;
     
      color:rgb(51 80 142);
      border: none;
      font-family: 'Inter', sans-serif;
      background: transparent;
      
      resize: none;
      min-height: 250px;
      padding:20px;
    }
    
    .textarea-wrapper{
      border-bottom: 1px solid rgb(241 241 241);
      display:flex;
      position:relative;
      justify-content:center;
      align-items:center;
    }
  
    .form-container input[type="text"] {
      width: 50%;
      padding-left: 14px;
      padding-right: 20px;
      font-family: 'Inter', sans-serif;
      padding-top:10px;
      padding-bottom:10px;
      outline:transparent;
      color:rgb(51 80 142);
      border: none; 
      background: transparent;
      resize: none;
    }

    /* When the textarea gets focus, do something */
    .form-container textarea:focus {
      background: transparent;
      outline: none;
    }

    /* Set a style for the submit/send button */
    .form-container .btn {
      position:relative;
      background-color: rgb(221 232 255);
    color: rgb(51 80 142);
    padding: 16px 20px;
    border: none;
    font-weight: 600 !important;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    width: -webkit-fill-available;
    letter-spacing: -0.4px;
    background-clip: padding-box;
    margin: 7px 7px 7px;
    border-radius: 9px;
    transition: background-color 0.3s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    column-gap:3px;


    }
   .btn:hover{
      background-color:rgb(213 225 248);
    }

    /* Add a red background color to the cancel button */
    .form-container .cancel {
      background-color: red;
      width: 70px;
      float: right;
      cursor: pointer;
    }

    /* Add some hover effects to buttons */
   

    #drop-area {
   
      position: absolute;
    transform: translateY(-100%);
    padding:9px;
  }


  #image-preview img{
    border-radius: 6px;
    max-height: 60px;
  }

  #iconContainer
  {
    
    background: #fff;
    border-radius: 30px;
    box-shadow: 0px 0 3px #00000054;
    display: flex;
    align-items: center;
    justify-content: center;
    top:0;
    right:0;
    cursor:pointer;
    position:absolute;
  }


  #extensionDiv {
    background: white;
    display: flex;
    justify-content: center;
    border-radius: 10px;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 2px;
  
  }



  .imagePicker {
    font-size: 1px;
    position: absolute;
    opacity: 0;
    cursor: pointer;
    top: 20px;
    right: 20px;
    width: 20px !important;
  }

  .attachmentContainer svg {
    width: 20px;
    right: 20px;
    position: absolute;
    top: 20px;
    cursor:pointer;
    color:rgb(192 192 192);
  }

  #overlaySuccess {
    
   
    justify-content: center;
    align-items: center;
    position: absolute;
    flex-direction: column;
    width: 100%;
    inset: 0px;
    transition: 0.3s;
    background: #ffffff;
    z-index: 2;
    cursor: pointer;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  #successTextHeading {
     font-size: 30px;
    font-family: 'Inter', sans-serif;
    margin-top: 5px;
     letter-spacing:-2px;
    margin-bottom: 5px;
    text-align: center;
    font-weight:600;
  }
  #text {
    display: flex;
    flex-direction: column;
    justify-content: center;

  }
  #successTextSubtitle
  {
    font-size: 14px;
    margin-top: 5px;
    margin-bottom: 20px;
    text-align: center;
    font-weight:400;
  }
  .field-wrapper {
    display:flex;
    align-items:center;
    border-bottom: 1px solid rgb(241 241 241) !important;

  }
  .field-wrapper > :first-child {
    border-right: 1px solid rgb(241 241 241) !important;
  }
  #successButton{
    background: transparent;
    border-radius: 20px;
    padding: 5px 10px;
    margin: auto;
    color:#ffffff;
    font-size:11px;
    cursor: pointer;
  }

  .successIconContainer{
    width: 50px;
    margin: auto;
  }

  .water-mark-text{
    text-align: center;
    font-size: 11px;
    color:#7c818b;
  }
  .water-mark-container{
    margin-top:9px;
    margin-bottom:9px;
  }

  .button--loading{color:transparent !important;} .button--loading::after { content: ""; position: absolute; width: 16px; height: 16px; top: 0; left: 0; right: 0; bottom: 0; margin: auto; border: 4px solid transparent; border-top-color: #7a8696; border-radius: 50%; animation: button-loading-spinner 1s ease infinite; } @keyframes button-loading-spinner { from { transform: rotate(0turn);}to {transform: rotate(1turn);}}

  .custom-flex-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.custom-flex-items {
    display: flex;
    align-items: center;
    gap: 0.6rem;
}

.custom-avatar-container {
    width: 2rem;
    height: 2rem;
    position:relative;
    background: linear-gradient(45deg, #fdfeff, #d8e4ff);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.0rem;
    text-transform:uppercase;
    color: #6290ff;
    font-weight: 500;
}

.custom-text-container {
    display: flex;
    flex-direction: column;
    row-gap: 2px;
}

.custom-text-container p {
 margin:0px;
}

.custom-message-text {
    font-size: 0.78rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 185px;
}

.redCounter{
  position: absolute;
    right: 0px;
    z-index:1;
    top: -8px;
    background: #ff2727;
    padding: 3px 6px;
    border-radius: 34px;
    color: #fff;
    font-size: 9px;
}
.custom-button {
    padding: 0.75rem 1.5rem;
    border-radius: 999px;
    font-size: 1.2rem;
    background-color: #4F46E5;
    color: #fff;
}

.align-self-center{
  align-self: center;
}
.info-message {
  height:341px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #b1b1b1;
  row-gap: 6px;
}
.info-text {
font-weight:500;
font-size:0.9rem;
}
.responseCount{
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  top: -3%;
}
.responseCountHeading{
  padding: 4px 10px;
  margin:0px;
  text-align: center;
  font-weight: 300;
  font-size: 11px;
  background: #517eea;
  box-shadow:1px 1px 7px #00000036;
  color: #fff;
  border-radius: 20px;

}

  `;

  var parentDiv = document.createElement("div");
  document.body.append(parentDiv);
  const userscomRoot = parentDiv.attachShadow({ mode: "open" });

  const style = document.createElement("style");

  const linkElement = document.createElement("link");
  linkElement.rel = "stylesheet";
  linkElement.href =
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";

  // Append the link element to the shadow DOM root
  document.head.appendChild(linkElement);

  const styleElement = document.createElement("style");
  styleElement.textContent = styles;

  // Append the style element to the shadow DOM
  userscomRoot.appendChild(styleElement);

  let uploadedFile = null;
  // const styleSheet = new CSSStyleSheet();
  // styleSheet.replaceSync(styles);
  // userscomRoot.adoptedStyleSheets = [styleSheet];

  // Create chat button
  if (projectDetails && projectDetails.icon != "image") {
    var img = document.createElement("div");
    var svg;

    switch (projectDetails.icon) {
      case "1":
        svg =
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" clip-rule="evenodd" /></svg>';
        break;

      case "2":
        svg =
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M5.337 21.718a6.707 6.707 0 01-.533-.074.75.75 0 01-.44-1.223 3.73 3.73 0 00.814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 01-4.246.997z" clip-rule="evenodd" /></svg>';
        break;

      case "3":
        svg =
          '<svg class="w-6 h-6 text-gray-700"  viewBox="0 0 364 364" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M327.6 0H36.4C26.7461 0 17.4876 3.83496 10.6613 10.6612C3.83499 17.4875 0 26.746 0 36.3998V254.798C0 264.452 3.83499 273.711 10.6613 280.537C17.4876 287.363 26.7461 291.198 36.4 291.198H91V345.798C91.0097 349.228 91.9888 352.586 93.8242 355.484C95.6597 358.382 98.2769 360.703 101.374 362.178C103.794 363.418 106.481 364.043 109.2 363.998C113.305 363.974 117.282 362.563 120.484 359.994L206.57 291.198H327.6C337.254 291.198 346.512 287.363 353.339 280.537C360.165 273.711 364 264.452 364 254.798V36.3998C364 26.746 360.165 17.4875 353.339 10.6612C346.512 3.83496 337.254 0 327.6 0Z" fill="currentColor" /></svg>';
        break;

      default:
    }

    console.log("svg");
    img.innerHTML = svg;
    img.className = "open-button";
  } else {
    var img = document.createElement("img");
    img.src = image;
    img.className = "open-button";
  }

  // Initially hide the button until iframe loads
  img.style.display = "none";

  // Create chat popup
  var chatPopup = document.createElement("div");
  if (position && position == "bl") {
    chatPopup.className = "chat-popup-left";
  } else {
    chatPopup.className = "chat-popup";
  }

  var welcomeMsg = document.createElement("div");
  welcomeMsg.innerHTML = welcomeText;
  if (position == "bl") {
    welcomeMsg.className = "welcomeMsgLeft";
  } else {
    welcomeMsg.className = "welcomeMsg";
  }
  welcomeMsg.style.display = "none"; 

  var unreadCounter = document.createElement("div");
  unreadCounter.innerHTML = 3;
  if (position == "bl") {
    unreadCounter.className = "unreadCounterLeft";
  } else {
    unreadCounter.className = "unreadCounter";
  }

  main_widget.id = "userscom-form";

  console.log("userAttributes...", userAttributes);
  iframe.src = `http://${projectDetails?.slug}.${IFRAME_URL}`;
  console.log("source...", iframe.src);
  chatIframe = iframe;
  
  iframe.onload = () => {
    iframeLoaded = true;
    // Send any pending messages
    if (pendingMessages.length > 0) {
      pendingMessages.forEach((attributes) => {
        sendMessageToIframe(attributes);
      });
      pendingMessages = []; 
    }
    
    img.style.display = "flex";
    
    setTimeout(function () {
      if (welcomeText) {
        welcomeMsg.style.display = "block";
      }
    }, 7000);
  };

  iframe.style.setProperty("width", "100%", "important");
  iframe.style.setProperty("height", "100%", "important");

  iframe.style.border = "none";
  // Append iframe to form
  main_widget.appendChild(iframe);

  // Append form to chat popup
  chatPopup.appendChild(main_widget);
  chatPopup.appendChild(img);
  chatPopup.appendChild(welcomeMsg);
  
  userscomRoot.appendChild(chatPopup);

  img.addEventListener("click", function () {
    if (main_widget.style.display === "block") {
      main_widget.style.display = "none";
    } else {
      console.log("clicked...");
      main_widget.style.display = "block";
      welcomeMsg.style.display = "none";
    }
  });
}

if (reference) {
  fetch(`${BASE_URL}/api/project/details/${reference}`, { method: "GET" })
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("userscomPlan", data.plan);
      projectDetails = data;
      ChatBox();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}