'use strict';

;(function () {
    window.ajax = {
        /*基本ajax封装*/
        request : function (args) {
            var method          = args.method           || 'GET',
                url             = args.url              || '',
                headers         = args.headers          || {},
                withCredentials = args.withCredentials  || true,
                body            = args.body             || null,
                timeout         = args.timeout          || 5000,
                responseType    = args.responseType     || 'JSON',
                async           = args.async            || true,
                callback        = args.callback,
                progress        = args.progress;

            var xhr = new XMLHttpRequest();
            xhr.open(method, url, async);
            xhr.timeout = timeout; // xhr的配置都需要在open之后、send之前，对应的bug是在IE上会报错

            for(var headerName in headers) {
                xhr.setRequestHeader(headerName, headers[headerName]);
            }
            if (withCredentials) {
                xhr.withCredentials = true;
            }
            if(callback) {
                xhr.onload = function() {
                    var result = xhr.responseText;
                    //parse response text
                    switch(responseType.toLowerCase()) {
                        case 'json': {
                            try {
                                result = JSON.parse(xhr.responseText);
                            }
                            catch(error) {
                                callback(error, null);
                                return;
                            }
                            break;
                        }
                    }

                    if (xhr.status === 200) {
                        callback(null, result);
                    } else {
                        callback(new Error('unexpected_status'), {status: xhr.status, response: result});
                    }
                };
                xhr.ontimeout = function() {
                    callback(new Error('timeout'), null);
                };
                xhr.onerror = function(error) {
                    callback(error, null);
                };
            }
            if (progress) {
                xhr.upload.onprogress = function (event) {
                    if (event && event.total != 0 && progress)
                        progress(event.loaded / event.total)
                };
            }
            xhr.send(body);
            return xhr;
        }, 
        // 简单请求
        simget: function(url,callback){
            this.request({
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                },
                callback: function(error,result){
                    callback(error, result);
                }
            });
        }, 
        // 简单请求
        simpost: function(url,params,callback){
            if (typeof params == 'function') {
                callback = params;
                params = {};
            } else if (typeof params == 'object'){

            } else {
                var err = new Error("第二个参数应该为函数或对象。");
                throw err;
            }
            this.request({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(params),
                callback: function(error,result){
                    if (result.errorCode == 3) {
                        window.location.href='./login.html';
                    } else {
                        callback(error, result);
                    }
                }
            });
        }
    }
})();