/*
 * Copyright (c) 2018. Vojin Petrovic.
 */

(function($){
  $.fn.vojjinSelect=function(options){
    let s=$.extend({
        action:'',
        func:'',
        delayOnType:600,
        preload:false,
        data:[],
        sort:2,

        maxShowEmpty:0,
        emptyResult:"No matches",
        showEmptyResult:true,
        hideEmptyResultAfter:1500,

        maxToRetrieve:0,
        tooManyResults:"Displaying first {1} items",
        showTooManyResult:true,
        hideTooManyResultAfter:1500
      },options),
      $this=this,hid,rDiv,p,tmr,tmr2,tmr3,pData=[],elid=$this.attr('id');
    if(s.func==='getid'){
      return $this.data('selId');
    }
    if(s.func==='gettext'){
      return $this.data('selText');
    }
    this.on('blur',function(){
      setTimeout(function(){
        _hideRes();
      },300);
    });
    this.on('focus',function(){
      _onFocus();
    });
    this.on('keyup',function(){
      _onKeyUp();
    });
    function _init(){
      $this.wrap('<div class="vojjinsel_wrap"></div>');
      p=$this.parent();
      p.css('flex-direction','column');
      $this.addClass('vojjinsel_important');
      hid=$('<input>').appendTo(p).attr('type','hidden').attr('id',elid+'_vojjinsel_id').attr('name',elid+'_vojjinsel_name');
      hid.val('');
      rDiv=$('<div>').appendTo(p).addClass('vojjinsel_maindiv').css('width',p.width()+'px');
      p.append('<span class="vojjinsel_wrap_span"><span class="vojjinsel_wrap_arrow"></span></span>');
      $('.vojjinsel_wrap_span').height($this.innerHeight());
      if(s.preload||s.data.length>1){
        s.delayOnType=10;
      }
      $(document).on('click','.vojjinsel_p',function(){
        let selId=parseInt($(this).data('id').toString()),selText=$(this).text().toString();
        $this.data('selId',selId);
        $this.data('selText',selText);
        hid.val(selId+'');
        $this.val(selText);
        _hideRes();
        $this.trigger('myChange');
      });
      $(window).resize(function(){
        rDiv.css('width',p.width()+'px');
      });
      if(s.preload&&s.data.length===0){
        let datas={q:'',mx:0,sort:s.sort,preload:1,mr:s.maxToRetrieve};
        $.ajax({
          url:s.action,type:'POST',dataType:'json',data:datas,success:function(res){
            if(res.length>0){
              pData=[];
              res.forEach(function(a){
                pData.push({id:a.id,t:a.t,q:a.q});
              });
            }
          }
        });
      }else if(s.data.length>0){
        s.preload=true;
        pData=[];
        s.data.forEach(function(a){
          pData.push({id:a.id,t:a.t,q:a.q});
        });
      }
    }
    function _onFocus() {
      hid.val('');
      _load();
    }
    function _onKeyUp() {
      hid.val('');
      try{clearTimeout(tmr);}catch(e){}
      try{clearTimeout(tmr2);}catch(e){}
      try{clearTimeout(tmr3);}catch(e){}
      tmr=setTimeout(function(){
        _load();
      },s.delayOnType);
    }
    function _load(){
      if(!s.preload){
        let datas={q:$.trim($this.val().toString()),mx:s.maxShowEmpty,sort:s.sort,mr:s.maxToRetrieve};
        $.ajax({
          url:s.action,type:'POST',dataType:'json',data:datas,success:function(res){
            _dispData(res,datas.q);
          }
        });
      }else{
        let q=$.trim($this.val().toString()),rData=[];
        if(q===''){
          if(pData.length<=s.maxShowEmpty||s.maxShowEmpty===0){
            pData.forEach(function(a){
              rData.push({id:a.id,t:a.t});
            });
          }
        }else{
          pData.forEach(function(a){
            let comp=a.t.toLowerCase();
            if (a.hasOwnProperty('q')) {
              comp=a.q.toLowerCase();
            }
            if(comp.indexOf(q.toLowerCase())>-1){
              rData.push({id:a.id,t:a.t});
            }
          });
        }
        _dispData(rData,q);
      }
    }
    function _dispData(res,q) {
      if(res.length===0){
        if(q===''){
          _hideRes();
        }else{
          if (s.showEmptyResult) {
            _showEmptyRes();
          } else {
            _hideRes();
          }
        }
      }else{
        _showRes(res);
      }
    }
    function _showRes(res){
      let out='';
      if (res.length===s.maxToRetrieve&&s.maxToRetrieve>0&&s.showTooManyResult) {
        out+='<p class="vojjinsel_p_max">'+s.tooManyResults.replace('{1}',s.maxToRetrieve)+'</p>';
        if (s.hideTooManyResultAfter>0) {
          tmr3=setTimeout(function(){$('.vojjinsel_p_max').hide('slow');},s.hideTooManyResultAfter);
        }
      }
      res.forEach(function(a){
        out+='<p class="vojjinsel_p" data-id="'+a.id+'">'+a.t+'</p>';
      });
      rDiv.html(out).addClass('vojjinsel_active');
    }
    function _showEmptyRes(){
      let out='<p class="vojjinsel_p_empty">'+s.emptyResult+'</p>';
      rDiv.html(out).addClass('vojjinsel_active');
      if (s.hideEmptyResultAfter>0) {
        tmr2=setTimeout(function(){_hideRes()},s.hideEmptyResultAfter);
      }
    }
    function _hideRes(){
      rDiv.html('').removeClass('vojjinsel_active');
    }
    this.each(function(){
      _init();
    });
    return this;
  };
}(jQuery));
