grammar_rules = [
  //conjuction places
  {
    ['[Pronoun]'],
    ['[Possesive]','[Noun]']
    ['[Possesive]','[Adjective]','[Noun]'],
    ['[Possesive]','[Adverb]','[Adjective]','[Noun]'],
    ['[Determiner]','[Noun]']
    ['[Noun]']
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
const conjuction_groups = function(terms,index,list) {
    let if_post=false;
    let if_pre = false;
    let terms_b="";
    let terms_a="";
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
    //Test for noun for after conjunction
    for(let o = 0; o < grammar_rules.length; o++) 
    {
      let rule = grammar_rules[o]
      terms_a = terms.slice(index+1,index+rule.length+1);
      if (hasTags(terms_a, rule))  {if_post=true; break;}
    }
    if(if_post && if_pre)
    {
      last_index=index+terms_a.length;
      first_index=index-terms_b.length;
      //Reduce the text in a group.
      let text_reduce=function(group_normal,term) {
        if(group_normal!='') return group_normal+' '+term.normal;
        else return ''+term.normal;
      }
      //Add the nouns to the group
      group[terms_b.reduce(text_reduce,initialValue=''),terms_a.reduce(text_reduce,initialValue='')]
      before_pre=terms[index-terms_b.length-1];
      if(before_pre)
      {
        let new_index=index-terms_b.length;
        let next=true;
        //Checks for groups containing more than two noun groups, like 'he, his friend and his sister' 
        //will be detcted as a single group
        while(next && (fns.endsWith(before_pre.text,',') || before_pre.text==','))
        {
          if(before_pre.text==',')
          {
            before_pre=terms[new_index-1];
            new_index--;
          }
          next=false; let new_pre=false;
          let terms_before='';
          for(let o = 0; o < grammar_rules.length; o++) 
          {
            let rule = grammar_rules[o];
            //does this rule match
            terms_before = terms.slice(new_index-rule.length, new_index);
            if (hasTags(terms_before, rule)) 
            {
              //New index to look for the previous group member
              new_index=new_index-rule.length-1;
              //The first index of the group
              first_index=new_index+1;
              //The term just before the current first group member
              before_pre=terms[new_index];
              //Adding the member just found to the group
              group.unshift(terms_before.reduce(text_reduce,initialValue=''));
              next=true;
              break;
            }
          }
        }
      }
      let text=terms_b+" "+terms[index].normal+" "+terms_a;
      list.Noun.groups=list.Noun.groups||[];
      group_details=[]
      for (let i = first_index; i < last_index; i++) 
      {
        group_details.unshift(terms[i]);
        terms[i].pos.Group=group;
      }
      list.Noun.groups.unshift({"text":group.reduce(function (str,ng){return str+ng;}),"details":group_details,
        "references":[]})
    }
  return terms;
};

module.exports=conjuction_groups;
