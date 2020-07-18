<template>
  <section class="post-list">
    <PostPreview
      id="1"
      thumbnail="https://www.netscribes.com/wp-content/uploads/2019/06/Technology-Watch.jpg"
      title="Hello there"
      previewText="This my first Post"
      :is-admin="isAdmin"
    />
    <PostPreview
      id="2"
      thumbnail="https://www.netscribes.com/wp-content/uploads/2019/06/Technology-Watch.jpg"
      title="Hello there"
      previewText="This my first Post"
      :is-admin="isAdmin"
    />
    <PostPreview
      id="3"
      thumbnail="https://www.netscribes.com/wp-content/uploads/2019/06/Technology-Watch.jpg"
      title="Hello there"
      previewText="This my first Post"
      :is-admin="isAdmin"
    />
  </section>
</template>

<script>
import PostPreview from "~/components/Posts/PostPreview";
export default {
  components: {
    PostPreview
  },
  props: {
    isAdmin: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.post-list {
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
</style>
