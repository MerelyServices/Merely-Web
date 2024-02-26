let textdecoder;
if('TextDecoder' in window) {
  textdecoder = new TextDecoder('utf-8');
} else {
  alert("This browser isn't supported!");
}

let gh_cache = JSON.parse(window.localStorage?.getItem('gh_cache') || '{}');
if(Object.keys(gh_cache).length == 0) {
  // Updates the cache time as soon as a value is fetched
  gh_cache.date = new Date().valueOf();
}else{
  // Clear the cache after 48 hours
  if(new Date().valueOf() - (1000 * 60 * 60 * 48) > gh_cache.date) {
    gh_cache = {'date': new Date().valueOf()};
  }
}

class GHNode {
  constructor(url) {
    this.url = url;
    return this;
  }

  async fetch() {
    if(this.url in gh_cache){
      this.data = gh_cache[this.url];
    }else{
      let response = await fetch(this.url);
      this.data = await response.json();
      // Store successful fetch in cache
      gh_cache[this.url] = this.data;
      window.localStorage?.setItem('gh_cache', JSON.stringify(gh_cache));
    }
    return this;
  }
}

class Tree extends GHNode {
  constructor(url) {
    super(url);
    return this;
  }
  async get_tree(name) {
    let treedata = this.data.tree.find(tree => tree.path == name && tree.type == 'tree');
    return await new Tree(treedata.url).fetch();
  }
  async get_file(name) {
    let filedata = this.data.tree.find(tree => tree.path == name && tree.type == 'blob');
    return await new File(filedata.url).fetch();
  }
}

class File extends GHNode {
  constructor(url) {
    super(url);
    return this;
  }
  get content() {
    return textdecoder.decode(Uint8Array.from(atob(this.data.content), c => c.charCodeAt(0)));
  }
}