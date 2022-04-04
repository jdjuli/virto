AFRAME.registerSystem('assets-manager', {
    init: function () {
        this.ids = new Set();
        this.assetsTag = this.sceneEl.querySelector('a-assets');
        this.errorHandler = this.errorHandler.bind(this);
    },
    update: function(params) {
        if(!this.assetsTag){
            this.assetsTag = document.createElement('a-assets');
            this.sceneEl.firstElementChild.before(this.assetsTag);
        }else{
            for(let e of this.assetsTag.children){
                this.ids.add(e.id);
            }
        }
        this.assetsTag.onload = (evt)=>{this.assetsTag.fileLoader.manager.onError = this.errorHandler;};
    },
    add: function(id,path) {
        if(this.ids.has(id)){
            console.error('Asset with id \''+id+'\' already registered');
        }else{
            this.ids.add(id);
            let assetElement;
            if(/(jpg|jpeg|png)$/i.test(path)){
                assetElement = document.createElement('img');
            }else if(/(mp3|wav)$/i.test(path)){
                assetElement = document.createElement('audio');
            }else if(/(mp4)$/i.test(path)){
                assetElement = document.createElement('video');
            }else{
                assetElement = document.createElement('a-asset-item');
            }
            assetElement.setAttribute('id',id);
            assetElement.setAttribute('src',path);
            this.assetsTag.appendChild(assetElement);
        }
    },
    delete(id){
        if(!this.ids.has(id) || !this.assetsTag[id]){
            console.error('No image registered with id \''+id+'\'');
        }else{
            this.assetsTag.removeChild(this.assetsTag[id]);
            delete this.assetsTag[id];
            this.ids.delete(id);
        }
    },
    errorHandler: function (evt) {
        let failedAsset = this.assetsTag.querySelector('[src=\''+evt+'\']');
        this.delete(failedAsset.id);
        console.info('Asset tag for resource \''+evt+'\' has been removed due a problem loading it');
    }
});