function updateViewCount(url) {
	function getIdeal() {
		const next_data = document.getElementById("__NEXT_DATA__");
		const json = JSON.parse(next_data.innerText);
		return {csrf: json.props.initialProps.csrfToken, xToken: json.props.initialState.common.user.xToken};
	}
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
	const body = JSON.stringify({
		query,
		variables: {
			target: url,
			targetSubject: "project"
		}
	});
	const {csrf, xToken} = getIdeal();
	const headers = {
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
	return fetch("/graphql", finalObj);
}
async function isLike(url) {
	function getIdeal() {
		const next_data = document.getElementById("__NEXT_DATA__");
		const json = JSON.parse(next_data.innerText);
		return {csrf: json.props.initialProps.csrfToken, xToken: json.props.initialState.common.user.xToken};
	}
	const query = `
		query CHECK_LIKE($target: String!, $groupId: ID){
			checkLike(target: $target, groupId: $groupId) {
				isLike
			}
		}
	`;
	const body = JSON.stringify({
		query,
		variables: {
			target: url,
			targetSubject: "project",
			targetType: "individual"
		}
	});
	const {csrf, xToken} = getIdeal();
	const headers = {
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
	const isLiked = await fetch("/graphql", finalObj).then(v => v.json()).then(v => v.data.checkLike.isLike);
	return isLiked;
}
async function likeProject(url) {
	function getIdeal() {
		const next_data = document.getElementById("__NEXT_DATA__");
		const json = JSON.parse(next_data.innerText);
		return {csrf: json.props.initialProps.csrfToken, xToken: json.props.initialState.common.user.xToken};
	}
	const isLiked = await isLike(url);
	if(isLiked) {
		const query = `
			mutation UNLIKE($target: String, $groupId: ID) {
				unlike(target: $target, groupId: $groupId) {
					target
					targetSubject
					targetType
				}
			}
		`;
		const body = JSON.stringify({
			query,
			variables: {
				target: url,
				targetSubject: "project",
				targetType: "individual"
			}
		});
		const {csrf, xToken} = getIdeal();
		const headers = {
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
		return fetch("/graphql", finalObj);
	} else {
		const query = `
			mutation LIKE($target: String, $targetSubject: String, $targetType: String, $groupId: ID) {
				like(target: $target, targetSubject: $targetSubject, targetType: $targetType, groupId: $groupId) {
					target
					targetSubject
					targetType
				}
			}
		`;
		const body = JSON.stringify({
			query,
			variables: {
				target: url,
				targetSubject: "project",
				targetType: "individual"
			}
		});
		const {csrf, xToken} = getIdeal();
		const headers = {
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
		return fetch("/graphql", finalObj);
	}
}
async function isFAV(url) {
	function getIdeal() {
		const next_data = document.getElementById("__NEXT_DATA__");
		const json = JSON.parse(next_data.innerText);
		return {csrf: json.props.initialProps.csrfToken, xToken: json.props.initialState.common.user.xToken};
	}
	const query = `
		query CHECK_FAV($target: String!, $groupId: ID){
			checkFav(target: $target, groupId: $groupId) {
				isFavorite
			}
		}
	`;
	const body = JSON.stringify({
		query,
		variables: {
			target: url,
			targetSubject: "project",
			targetType: "individual"
		}
	});
	const {csrf, xToken} = getIdeal();
	const headers = {
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
	const isFAV_ = await fetch("/graphql", finalObj).then(v => v.json()).then(v => v.data.checkFav.isFavorite);
	return isFAV_;
}
async function FAVProject(url) {
	function getIdeal() {
		const next_data = document.getElementById("__NEXT_DATA__");
		const json = JSON.parse(next_data.innerText);
		return {csrf: json.props.initialProps.csrfToken, xToken: json.props.initialState.common.user.xToken};
	}
	const isFAV_ = await isFAV(url);
	if(isFAV_) {
		const query = `
			mutation UNFAV($target: String, $groupId: ID) {
				unfav(target: $target, groupId: $groupId) {
					target
					targetSubject
					targetType
				}
			}
		`;
		const body = JSON.stringify({
			query,
			variables: {
				target: url,
				targetSubject: "project",
				targetType: "individual"
			}
		});
		const {csrf, xToken} = getIdeal();
		const headers = {
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
		return fetch("/graphql", finalObj);
	} else {
		const query = `
			mutation FAV($target: String, $targetSubject: String, $targetType: String, $groupId: ID) {
				fav(target: $target, targetSubject: $targetSubject, targetType: $targetType, groupId: $groupId) {
					target
					targetSubject
					targetType
				}
			}
		`;
		const body = JSON.stringify({
			query,
			variables: {
				target: url,
				targetSubject: "project",
				targetType: "individual"
			}
		});
		const {csrf, xToken} = getIdeal();
		const headers = {
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
		return fetch("/graphql", finalObj);
	}
}
setTimeout(async function frame() {
	"use strict";
	const allEntryStory = document.getElementsByClassName("eelonj20");
	const errorMsg = "페이지 로딩이 되지 않음";
	for(const entryStory of allEntryStory) {
		if(entryStory.querySelector("iframe")) continue; // iframe이 이미 있으면 건너뜀.
		const detail = entryStory.querySelector(".e1i41bku1");
		const match = detail.textContent.match(/https:\/\/playentry\.org\/project\/[0-9a-f]{24}/i);
		if(match) {
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
					button.className += " view-apply";
				} catch(e) {}
			});
			const likeButton = document.createElement("div");
			likeButton.style.float = "left";
			likeButton.style.cursor = "pointer";
			const isLiked = await isLike(match[0].match(/[0-9a-f]{24}/i)[0]);
			if(isLiked) {
				likeButton.style.background = "url(https://playentry.org/img/IcoFnBtnLikeHover.svg) no-repeat center / contain";
			} else {
				likeButton.style.background = "url(https://playentry.org/img/IcoFnBtnLike.svg) no-repeat center / contain";
			}
			likeButton.style.width = likeButton.style.height = "40px";
			likeButton.addEventListener("click", async function() {
				await likeProject(match[0].match(/[0-9a-f]{24}/i)[0]);
				const isLiked = await isLike(match[0].match(/[0-9a-f]{24}/i)[0]);
				if(isLiked) {
					likeButton.style.background = "url(https://playentry.org/img/IcoFnBtnLikeHover.svg) no-repeat center / contain";
				} else {
					likeButton.style.background = "url(https://playentry.org/img/IcoFnBtnLike.svg) no-repeat center / contain";
				}
			});

			const bookmarkButton = document.createElement("div");
			bookmarkButton.style.float = "left";
			bookmarkButton.style.cursor = "pointer";
			bookmarkButton.style.background = "url(https://playentry.org/img/IcoFnBtnBookMark.svg) no-repeat center / contain";
			bookmarkButton.style.width = bookmarkButton.style.height = "40px";
			bookmarkButton.style.marginLeft = "10px";
			bookmarkButton.addEventListener("click", async function() {
				await FAVProject(match[0].match(/[0-9a-f]{24}/i)[0]);
				const isFAV_ = await isFAV(match[0].match(/[0-9a-f]{24}/i)[0]);
				if(isFAV_) {
					bookmarkButton.style.background = "url(https://playentry.org/img/IcoFnBtnBookMarkHover.svg) no-repeat center / contain";
				} else {
					bookmarkButton.style.background = "url(https://playentry.org/img/IcoFnBtnBookMark.svg) no-repeat center / contain";
				}
			});

			addEventListener("resize", resize);
			resize();
			detail.appendChild(iframe);
			detail.appendChild(likeButton);
			detail.appendChild(bookmarkButton);
		}
	}
	setTimeout(frame);
});
