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


    }
}

module.exports = forumPostQueries;