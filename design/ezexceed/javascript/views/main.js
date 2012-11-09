define(['shared/view', 'keymedia/models', './tagger', './upload', 'brightcove'], function(View, Models, TaggerView, UploadView)
{
    return View.extend({
        media : null,
        versions : null,
        version : null,

        initialize : function(options)
        {
            options = (options || {});
            _.bindAll(this);
            _.extend(this, _.pick(options, ['id', 'version']));

            var data = this.$el.data();
            _.extend(data, this.$('.attribute-base').data());

            var urlRoot = '/ezjscore/call';
            if (data.urlRoot !== '/') urlRoot = data.urlRoot + urlRoot;

            this.model = new Models.attribute({
                id : data.id,
                version : this.version,
                media : data.bootstrap
            }, {parse : true});
            this.model.urlRoot = urlRoot;
            this.model
                .on('change', this.render)
                .on('version.create', this.versionCreated);

            this.collection = new Models.collection();
            this.collection.urlRoot = urlRoot;
            this.collection.id = data.id;
            this.collection.version = this.version;

            this.on('saved', this.update, this);

            return this;
        },

        events : {
            'click button.from-keymedia' : function(e)
            {
                e.preventDefault();
                require(['keymedia/views/browser'], this.browse);
            },
            'click button.scale' : function(e)
            {
                e.preventDefault();
                require(['keymedia/views/scaler'], this.scale);
            },
            'click .remove' : 'removeMedia'
        },

        removeMedia : function(e)
        {
            e.preventDefault();
            var data = this.$('.data').val('').serializeArray();

            data.push({
                name : 'mediaRemove',
                value : 1
            });

            this.trigger('save', this.model.id, data);
            this.remove(this.$('.eze-image'));
        },

        browse : function(BrowseView)
        {
            var options = {
                model : this.model,
                version : this.version,
                collection : this.collection
            };

            var context = {
                icon : '/extension/ezexceed/design/ezexceed/images/kp/32x32/Pictures.png',
                heading : 'Select media',
                render : true
            };
            eZExceed.stack.push(
                BrowseView,
                options,
                context
            ).on('destruct', this.changeMedia);
            this.collection.search('');
        },

        // Start render of scaler sub-view
        scale : function(ScaleView)
        {
            var data = this.$("button.scale").data();
            var options = {
                model : this.model,
                versions : data.versions,
                trueSize : data.truesize
            };

            var context = {
                icon : '/extension/ezexceed/design/ezexceed/images/kp/32x32/Pictures-alt-2b.png',
                className : 'dark',
                heading : 'Select crops',
                render : true
            };

            this.model.fetch().success(function(response)
            {
                eZExceed.stack.push(
                    ScaleView,
                    options,
                    context
                );
            });
            return this;
        },

        changeMedia : function(data, pop)
        {
            if (!data.refresh) return;

            this.$('.media-id').val(data.id);
            this.$('.media-host').val(data.host);
            this.$('.media-type').val(data.type);
            this.$('.media-ending').val(data.ending);

            data = this.$(':input').serializeArray();
            data.push({
                name : 'changeMedia',
                value : 1
            });

            this.trigger('save', this.model.id, data);
        },

        update : function()
        {
            this.model.fetch();
        },

        render : function()
        {
            var content = this.model.get('content');
            var media = this.model.get('media');
            if (content) {
                this.$('.attribute-base').html(content);
            }

            var file = media.get('file');
            if (file && 'type' in file && file.type.match(/video/)) {
                if (typeof brightcove !== 'undefined')
                    brightcove.createExperiences();
            }

            this.taggerView = new TaggerView({
                el : this.$('.keymedia-tags'),
                model : media
            }).render();

            if (!content || !media || !media.id) {
                this.enableUpload();
            }

            return this;
        },

        enableUpload : function() {
            this.upload = new UploadView({
                model : this.model,
                uploaded : this.changeMedia,
                el : this.$el,
                version : this.version
            }).render();
            return this;
        },

        versionCreated : function(versions)
        {
            this.model.trigger('autosave.saved');
            this.trigger('save', 'triggerVersionUpdate', {'triggerVersionUpdate' : 1});
            this.$("button.scale").data('versions', versions);
        }
    });
});
