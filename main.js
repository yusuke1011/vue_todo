// ローカルストレージ
// 参考：https://jp.vuejs.org/v2/examples/todomvc.html
const STORAGE_KEY = 'todos-vuejs-demo'
const todoStorage = {
    //ローカルストレージに保存されているtodos配列を変換して返すメソッド
    fetch() {
        let todos = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || '[]'
        )
        todos.forEach(function(todo, index) {
        todo.id = index
        })
        todoStorage.uid = todos.length
        return todos
    },
    //todos配列をJSON形式に変換して、ローカルストレージに保存するメソッド
    save(todos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    }
}

const app = new Vue({
    el: '#app',
    data: {
        todos: [], //Todoリスト用データ
        options: [ //絞り込み機能用の選択肢
            { value: -1, label: 'すべて' },
            { value: 0,  label: '作業中' },
            { value: 1,  label: '完了' }
        ],
        current: -1
    },
    methods: {
        doAdd(event, value){
            const comment = this.$refs.comment;
            if(!comment.value.length){
                return;
            }

            this.todos.push({
                id: todoStorage.uid++,
                comment: comment.value,
                state: 0
            });

            comment.value = '';
        },
        doChangeState(item){
            item.state = item.state ? 0 : 1;
        },
        doRemove(item){
            const index = this.todos.indexOf(item);
            this.todos.splice(index, 1);
        }
    },
    //ウォッチャ
    watch: {
        todos: {
            handler(todos){
                todoStorage.save(todos)
            },
            //deepオプションを有効にすることで、ネストしているデータも監視可能
            deep: true
        }
    },
    //ライフサイクルフック：インスタンス生成時
    created(){
        this.todos = todoStorage.fetch();
    },
    //算出プロパティ
    computed: {
        computedTodos(){
            return this.todos.filter((element) => {
                return this.current < 0 ? true : element.state === this.current;
            });
        }
    },
    //フィルタ
    filters: {
        convertStatus(status){
            return status ? '完了' : '作業中';
        }
    }
});

