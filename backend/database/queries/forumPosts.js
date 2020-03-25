const knex = require('../');

const forumPostQueries = {
    async getCategories(){

        try{

            const result = await knex.select('*').from('forum_categories');

            return result;

        }catch(e){
            console.log(e);
            throw new Error('Server unable to obtain categories from database');
        }


    }, 
    async checkIfPostLimitReached(userId){

        try{

            const result = knex.count('*').as('count').from('forum_posts').where({
                author_user_id : userId
            }).andWhereRaw("created_at < INTERVAL '1 day'");

            if(+result[0].count >= 3)
                return true;
            else return false;


        }catch(e){
            console.log(e);
            throw new Error('Server unable to obtain data from database');
        }

    }, 
    async insertNewForumPost({authorUserId, categoryId, headline, content, mainImg}){

        try{

            await knex('forum_posts').insert({
                author_user_id : authorUserId, 
                category_id : categoryId, 
                headline, 
                content, 
                main_img : mainImg
            });

        }catch(e){
            console.log(e);
            throw new Error('Unable to insert data into database.');
        }

    }
}

module.exports = forumPostQueries;