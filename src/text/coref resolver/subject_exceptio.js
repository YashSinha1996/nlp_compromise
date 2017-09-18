grammar_rules = [
  {
    ['by','[Noun]']
    ['by','[Determiner]','[Noun]'],
    ['by','[Determiner]','[Adjective]','[Noun]'],
  }
  
];
//tests a subset of terms against a array of tags
const hasTags = function(terms, tags) {
  if (terms.length !== tags.length) {
    return false;
  }
  for(let i = 0; i < tags.length; i++) {
    //do a [tag] match
    if (fns.startsWith(tags[i], '[') && fns.endsWith(tags[i], ']')) {
      let pos = tags[i].match(/^\[(.*?)\]$/)[1];
      if (!terms[i].pos[pos]) {
        return false;
      }
    } else if (terms[i].normal !== tags[i]) { //do a text-match
      return false;
    }

  }
  return true;
};

//hints from the sentence grammar
const exception_finder = function(terms,index,sentence_no,listArray) {
    return "object";
    //Can't figure out how to make it work properly yet :(
    let if_post=false;
    let if_pre = false;
    let terms_b="";
    let last_index=-1,first_index=-1;
    //The group
    let group=[];
    //Test for noun for before conjuction
    for(let o = 0; o < grammar_rules.length; o++) 
    {
      let rule = grammar_rules[o];
      //does this rule match
      terms_b = terms.slice(index-rule.length, index);
      if (hasTags(terms_b, rule)) {if_pre=true; break;}
    }
    if(if_pre)
    {
      for(p in listArray)
      {
        let k=0;
        /*while(p[p.length-k].sentence_no==sentence_no)
        {
          if () {}
          k++;
        }*/
      }
    }
  }

module.exports=exception_finder;
