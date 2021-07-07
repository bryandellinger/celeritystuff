import { setTimeout } from "core-js";

export default class BaseService {
    /**
     * AJAX GET
     * @param {string} url Request URL
     * @param {Object} [data] Optional. Request data
     * @param {string} [dataType=json] Optional. Expected datatype of data returned from server. (Default = 'json')
     * @returns {Promise} Promise object
     */
	static ajaxGet(url, data, dataType) {

		this.waitForCookies();

		return new Promise((resolve, reject) => {
            $.ajax({
                url,
                data,
                dataType: dataType || 'json',
                cache: false
            })
				.done((responseData) => {
					this.postServiceActions();
					resolve(responseData);
                })
                .fail((jqXHR) => {
                    this.handleErrors(jqXHR, reject);
                });
        });
    }

	static waitForCookies() {
		if (document.cookie.split(';').filter((item) => item.includes('Cookies=')).length) {
			// console.log('Got the cookie');
		}
		else {
			// console.log('No cookie present');
			setTimeout(waitForCookies(), 1000);
		}
	}

    /**
     * AJAX POST
     * @param {string} url Request URL
     * @param {Object} [data] Optional request data
     * @returns {Promise} Promise object
     */
    static ajaxPost(url, data) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url,
                data: this.addAntiForgeryToken(data),
                type: 'POST'
            })
                .done((responseData) => {
					this.postServiceActions();
					resolve(responseData);
                })
                .fail((jqXHR) => {
                    this.handleErrors(jqXHR, reject);
                });
        });
    }

    /**
     * AJAX DELETE
     * @param {string} url Request URL
     * @param {Object} [data] Optional request data
     * @returns {Promise} Promise object
     */
    static ajaxDelete(url, data) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url,
                data: this.addAntiForgeryToken(data),
                type: 'DELETE'
            })
                .done((responseData) => {
					this.postServiceActions();
					resolve(responseData);
                })
                .fail((jqXHR) => {
                    this.handleErrors(jqXHR, reject);
                });
        });
    }

    static handleErrors(xhr, reject) {
        switch (xhr.status) {
        case 403: // not authorized
            window.location.reload();
            break;
        default:
            reject(xhr.statusText);
            break;
        }
    }

    static addAntiForgeryToken(data) {
        const antiForgeryToken = $('#__AjaxAntiForgeryForm input[name=__RequestVerificationToken]').val();

        return Object.assign(data, { __RequestVerificationToken: antiForgeryToken });
	}

	static postServiceActions() {
		if (window.app && window.app.components && window.app.components.sessionManager) {
			window.app.components.sessionManager.extendLocalSession();
		}
	}
}
