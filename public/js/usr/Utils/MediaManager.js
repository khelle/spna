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
        this.files.onchange = $.proxy(this.UploadGraph, this);

        return this;
    };

    this.PrepareUpload = function() {
        return this.files.click();
    };

    this.PrepareDownload = function() {
        return this.DownloadGraph();
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

            formData.append('files[]', file, file.name);
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

    this.StartDownloading = function(url) {
        var downloader = document.querySelector('#graph-download');

        var app = this.app;
        var message = 'File is being downloaded. If you don\'t see downloading wind, please go to your browser default downloading directory.';
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
