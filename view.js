function send(query, variables) { // graphql로 POST 요청을 보내는 함수
	function getIdeal() {           // 대충 csrf와 xToken을 구하는 함수
		const next_data = document.getElementById("__NEXT_DATA__"); // json 정보가 담긴 스크립트
		const object = JSON.parse(next_data.innerText);             // json을 자바스크립트 객체로 변환
		return {
			csrf: object.props.initialProps.csrfToken,            // csrf
			xToken: object.props.initialState.common.user?.xToken, // xToken
		};
	}
	const body = JSON.stringify({ query, variables }); // body 작성
	const {csrf, xToken} = getIdeal(); // csrf, xToken 구하기
	const headers = { // 헤더 작성
		"Content-Type": "application/json",
		"CSRF-Token": csrf,
		"x-token": xToken,
		"x-client-type": "Client"
	};
	const finalObj = {
		body,
		headers,
		method: "POST"
	};
	return fetch("/graphql", finalObj); // POST 요청 보내기
}
function getLikeAndFAVCnt(id) {
	const query = `
		query SELECT_PROJECT_LITE($id: ID! $groupId: ID) {
			project(id: $id, groupId: $groupId) {
				likeCnt
				favorite
      			}
		}
	`;
	const variables = { id };
	return send(query, variables).then(v => v.json()).then(v => v.data.project);
}
function updateViewCount(url) { // 조회수 늘리기
	const query = `
		mutation UPDATE_VIEWCOUNT(
			$target: ID!, $targetSubject: String, $groupId: ID
		) {
			updateViewCount(
				target: $target, targetSubject: $targetSubject, groupId: $groupId
			) {
				status
				result
			}
		}
	`;
	const variables = {
		target: url,
		targetSubject: "project"
	};
	return send(query, variables);
}
function isLike(url) {
	const query = `
		query CHECK_LIKE($target: String!, $groupId: ID){
			checkLike(target: $target, groupId: $groupId) {
				isLike
			}
		}
	`;
	const variables = {
		target: url,
		targetSubject: "project",
		targetType: "individual"
	};
	const isLiked = send(query, variables).then(v => v.json()).then(v => v.data.checkLike?.isLike);
	return isLiked;
}
async function likeProject(url) {
	const isLiked = await isLike(url);
	let query, variables;
	if(isLiked) {
		query = `
			mutation UNLIKE($target: String, $groupId: ID) {
				unlike(target: $target, groupId: $groupId) {
					target
					targetSubject
					targetType
				}
			}
		`;
		variables = {
			target: url,
			targetSubject: "project",
			targetType: "individual"
		};
	} else {
		query = `
			mutation LIKE($target: String, $targetSubject: String, $targetType: String, $groupId: ID) {
				like(target: $target, targetSubject: $targetSubject, targetType: $targetType, groupId: $groupId) {
					target
					targetSubject
					targetType
				}
			}
		`;
		variables = {
			target: url,
			targetSubject: "project",
			targetType: "individual"
		};
	};
	return send(query, variables);
}
function isFAV(url) {
	const query = `
		query CHECK_FAV($target: String!, $groupId: ID){
			checkFav(target: $target, groupId: $groupId) {
				isFavorite
			}
		}
	`;
	const variables = {
		target: url,
		targetSubject: "project",
		targetType: "individual"
	};
	const isFAV_ = send(query, variables).then(v => v.json()).then(v => v.data.checkFav?.isFavorite);
	return isFAV_;
}
async function FAVProject(url) {
	const isFAV_ = await isFAV(url);
	let query, variables;
	if(isFAV_) {
		query = `
			mutation UNFAV($target: String, $groupId: ID) {
				unfav(target: $target, groupId: $groupId) {
					target
					targetSubject
					targetType
				}
			}
		`;
		variables = {
			target: url,
			targetSubject: "project",
			targetType: "individual"
		};
	} else {
		query = `
			mutation FAV($target: String, $targetSubject: String, $targetType: String, $groupId: ID) {
				fav(target: $target, targetSubject: $targetSubject, targetType: $targetType, groupId: $groupId) {
					target
					targetSubject
					targetType
				}
			}
		`;
		variables = {
			target: url,
			targetSubject: "project",
			targetType: "individual"
		};
	};
	return send(query, variables);
}
async function addIFrame(detail, match, errorMsg) {
	function resize() {
		iframe.width = detail.offsetWidth;
		iframe.height = detail.offsetWidth * (9 / 16) + 48;
	}
	const iframe = document.createElement("iframe");
	iframe.src = match[0].replace("project", "iframe");
	iframe.frameBorder = 0;
	setInterval(function() {
		try {
			const head = iframe.contentDocument.head;
			if(!head) throw errorMsg;
			if(head.querySelector("#exp-style")) return;
			const style = document.createElement("style");
			style.id = "exp-style";
			style.textContent = ".entryMaximizeButtonMinimize { display: none } .css-13694u8 { right: 60px !important }";
			head.appendChild(style);
		} catch(e) {}
	});
	setInterval(function() {
		try {
			const button = iframe.contentDocument.querySelector(".entryRunButtonBigMinimize");
			if(button.className.includes("view-apply")) return;
			function addViews() {
				updateViewCount(match[0].match(/[0-9a-f]{24}/i)[0]);
			}
			button.addEventListener("click", addViews);
			button.classList.add("view-apply");
		} catch(e) {}
	});
	if(!document.getElementById("dut-frame-stylesheet")) {
		const stylesheet = document.createElement("style");
		stylesheet.id = "dut-frame-stylesheet";
		stylesheet.textContent = `
			.dut-frame-button {
				float: left;
				cursor: pointer;
				width: 40px;
				height: 40px;
			}

			.bookmark-button {
				margin-left: 10px;
			}

			.like-button::before {
				display: block;
				line-height: 40px;
				text-align: center;
				content: attr(like-cnt);
			}

			.bookmark-button::before {
				display: block;
				line-height: 30px;
				text-align: center;
				content: attr(bookmark-cnt);
			}
		`;
		document.head.appendChild(stylesheet);
	}
	const likeButton = document.createElement("div");
	(async function() {
		likeButton.classList.add("dut-frame-button", "like-button");
		const isLiked = await isLike(match[0].match(/[0-9a-f]{24}/i)[0]);
		if(isLiked) {
			likeButton.style.background = "url(https://playentry.org/img/IcoFnBtnLikeHover.svg) no-repeat center / contain";
		} else {
			likeButton.style.background = "url(https://playentry.org/img/IcoFnBtnLike.svg) no-repeat center / contain";
		}
		likeButton.setAttribute("like-cnt", (await getLikeAndFAVCnt(match[0].match(/[0-9a-f]{24}/i)[0])).likeCnt);
		likeButton.addEventListener("click", async function() {
			await likeProject(match[0].match(/[0-9a-f]{24}/i)[0]);
			const isLiked = await isLike(match[0].match(/[0-9a-f]{24}/i)[0]);
			if(isLiked) {
				this.style.background = "url(https://playentry.org/img/IcoFnBtnLikeHover.svg) no-repeat center / contain";
			} else {
				this.style.background = "url(https://playentry.org/img/IcoFnBtnLike.svg) no-repeat center / contain";
			}
			this.setAttribute("like-cnt", (await getLikeAndFAVCnt(match[0].match(/[0-9a-f]{24}/i)[0])).likeCnt);
		});
	}());

	const bookmarkButton = document.createElement("div");
	(async function() {
		bookmarkButton.classList.add("dut-frame-button", "bookmark-button");
		const isFAV_ = await isFAV(match[0].match(/[0-9a-f]{24}/i)[0]);
		if(isFAV_) {
			bookmarkButton.style.background = "url(https://playentry.org/img/IcoFnBtnBookMarkHover.svg) no-repeat center / contain";
		} else {
			bookmarkButton.style.background = "url(https://playentry.org/img/IcoFnBtnBookMark.svg) no-repeat center / contain";
		}
		bookmarkButton.setAttribute("bookmark-cnt", (await getLikeAndFAVCnt(match[0].match(/[0-9a-f]{24}/i)[0])).favorite);
		bookmarkButton.addEventListener("click", async function() {
			await FAVProject(match[0].match(/[0-9a-f]{24}/i)[0]);
			const isFAV_ = await isFAV(match[0].match(/[0-9a-f]{24}/i)[0]);
			if(isFAV_) {
				this.style.background = "url(https://playentry.org/img/IcoFnBtnBookMarkHover.svg) no-repeat center / contain";
			} else {
				this.style.background = "url(https://playentry.org/img/IcoFnBtnBookMark.svg) no-repeat center / contain";
			}
			this.setAttribute("bookmark-cnt", (await getLikeAndFAVCnt(match[0].match(/[0-9a-f]{24}/i)[0])).favorite);
		});
	}());

	addEventListener("resize", resize);
	resize();
	detail.appendChild(iframe);
	detail.appendChild(likeButton);
	detail.appendChild(bookmarkButton);
}
setTimeout(async function frame() {
	"use strict";
	const allEntryStory = document.getElementsByClassName("eelonj20");
	const errorMsg = "페이지 로딩이 되지 않음";
	for(const entryStory of allEntryStory) {
		if(entryStory.querySelector("iframe")) continue; // iframe이 이미 있으면 건너뜀.
		const detail = entryStory.querySelector(".e1i41bku1");
		const match = detail.textContent.replace("http://", "https://").match(/https:\/\/playentry\.org\/project\/[0-9a-f]{24}/i);
		if(match) await addIFrame(detail, match, errorMsg);
	}
	setTimeout(frame);
});
