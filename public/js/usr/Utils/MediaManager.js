var MediaManager = function(app, ajax) {
    this.app  = app;
    this.ajax = ajax;

    this.files   = null;
    this.submit  = null;
    this.changed = false;

    this.Constructor = function() {
        var proxy;

        this.files  = document.getElementById('graph-upload-file');
        this.submit = document.getElementById('graph-upload-submit');

        proxy = this;
        this.files.onchange = $.proxy(this.UploadMechanism, this);

        return this;
    };

    this.PrepareUpload = function() {
        this.UploadingMessage();
        this.files.click();
    };

    this.PrepareDownload = function() {
        return this.DownloadGraph();
    };

    this.UploadMechanism = function() {
        this.UploadGraph();

        var proxy = this;
        this.ajax.HttpGet('/api/graph', null, function(data, status) {
            proxy.app.ClosePromptMessage();
            proxy.app.Storage.Build(data.data.graph);
            proxy.app.Renderer.Paint();
        });
    };

    this.UploadGraph = function() {
        var formData;
        var files;
        var fileSelect;

        fileSelect = document.getElementById('graph-upload-file');
        formData = new FormData();
        files = fileSelect.files;

        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            formData.append('graph', file, file.name);
        }

        this.ajax.HttpMultipart('/api/graph/file', formData);
    };

    this.DownloadGraph = function() {
        var proxy = this;

        this.ajax.HttpGet('/api/graph/file', null, function(data, status) {
            if (data.status === true) {
                proxy.StartDownloading(data.data.path);
            }
        })
    };

    this.UploadingMessage = function() {
        var app = this.app;
        var message = 'File is being uploaded. If you don\'t see downloading window, please refer to your browser settings.';
        app.PromptMessage(
            'Uploading File...',
            message,
            [
                {
                    type: 'close',
                    fn: function() {
                        app.ClosePromptMessage();
                    }
                }
            ],
            [
                {
                    name: 'OK',
                    fn: function() {
                        app.ClosePromptMessage();
                    }
                }
            ]
        );
    };

    this.StartDownloading = function(url) {
        var downloader = document.querySelector('#graph-download');

        var app = this.app;
        var message = 'File is being downloaded. If you don\'t see downloading window, please go to your browser default downloading directory.';
        app.PromptMessage(
            'Downloading File...',
            message,
            [
                {
                    type: 'close',
                    fn: function() {
                        app.ClosePromptMessage();
                    }
                }
            ],
            [
                {
                    name: 'OK',
                    fn: function() {
                        app.ClosePromptMessage();
                    }
                }
            ]
        );

        downloader.href = url;
        downloader.click();
    };

    return this.Constructor();
};
