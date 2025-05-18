<template>
  <div class="dt-test">
    <van-popup v-model="show" round position="bottom" :style="{ height: '580px' }">
      <div class="contest-popup">
        <div class="contest-popup-toolBar van-hairline--bottom">
          <div class="text-l">题目列表</div>
          <div class="text-r">
            <div style="width: 10px; height: 10px; border-radius: 50%; background-color: #00a400"></div>
            <span class="answered">已答</span>
            <div style="width: 10px; height: 10px; border-radius: 50%; background-color: #aaa; margin-left: 10px"></div>
            <span class="unAnswer">未答</span>
          </div>
        </div>
        <div class="option-container">
          <!-- <div v-if="question.length > 0" class="contest-popup-danxuan">判断题</div> -->
          <div class="contest-popup-danxuan-list">
            <div v-for="(i, index) in question" :key="index" class="list-item">
              <div :class="!i.isUnAnswer ? 'answered-bgc' : ''" class="item" @click="changIdx(i)">{{ i.num }}</div>
            </div>
          </div>
        </div>
        <div class="commit">
          <van-button class="commit-btn" size="large" round @click="toAnswer">重新答题</van-button>
        </div>
      </div>
    </van-popup>
    <Nav :is-show-right="true" :is-show-time="false" :title="title" @right-click="rightClick"></Nav>
    <div class="dt-test-subjects">
      <div v-for="(item, index) in question" v-show="index === idx" :key="index" class="subject-item">
        <div class="subject-type">
          <span>第{{ index + 1 }}题</span>
          <span>丨</span>
          <span v-if="item.tSubject == 3" class="subject-type-item">多选题</span>
          <span v-if="item.tSubject == 2" class="subject-type-item">单选题</span>
          <span v-if="item.tSubject == 1" class="subject-type-item">判断题</span>
          <span v-if="item.tSubject == 5" class="subject-type-item">问答题</span>
          <span v-if="item.tSubject == 4" class="subject-type-item">填空题</span>
          <span v-if="item.tSubject == 11" class="subject-type-item">组合题</span>
        </div>
        <div class="subject-title">
          <JaxMath :data="item.title"></JaxMath>
        </div>
        <div v-if="item.tSubject === 5 || item.tSubject === 4" class="subject-options">
          <div class="zg">
            <div v-if="showUpload" class="jc-pic">
              <!-- :disabled="item.stuAnswer && item.stuAnswer.length > 0" -->
              <van-field v-model.trim="item.textAnswer" disabled rows="4" label="" type="textarea" placeholder="请填写答案" @input="onTextAnswer" />
              <!-- <van-uploader disabled @click-upload="jjj"></van-uploader> -->
              <div class="jc-pic-upload">
                <img v-if="item.stuAnswer" :src="item.stuAnswer" class="avatar" @click.native="previewImg(item.stuAnswer)" />
                <van-icon v-else name="plus" size="2rem" />
                <!-- <van-icon v-show="item.stuAnswer" name="cross" class="avatar-close-icon" size="1.5rem" /> -->
              </div>
              <!-- <el-input v-if="showUpload" :rows="6" resize="none" type="textarea" v-model.trim="item.textAnswer" @input="onTextAnswer"></el-input> -->
              <!-- <el-upload
                ref="avatar-uploader"
                :multiple="false"
                :with-credentials="true"
                class="avatar-uploader"
                :auto-upload="true"
                :http-request="uploadSureFile"
                :before-upload="beforeAvatarUpload"
                action=""
                :show-file-list="false"
              >
                <img v-if="item.stuAnswer" :src="item.stuAnswer" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <i v-show="item.stuAnswer" class="el-icon-close avatar-close-icon" @click="removePic"></i> -->
            </div>
          </div>
          <!-- <div class="upload-icon-pic" @click="handleUpload(item)"></div>
          <div v-if="item.stuAnswer" class="upload-icon-img">
            <img :src="item.stuAnswer" alt="" />
          </div> -->
        </div>
        <div v-if="item.tSubject === 11" class="subject-options">
          <div class="zh">
            <div v-for="(a, b) in item.sonSubList" :key="b">
              <div class="son-subject-title">
                {{ b + 1 }}、<span v-if="a.tSubject == 3">(多选题)</span><span v-if="a.tSubject == 2">(单选题)</span
                ><span v-if="a.tSubject == 1">(判断题)</span><span v-if="a.tSubject == 5">(问答题)</span><span v-if="a.tSubject == 4">(填空题)</span>
                <JaxMath :data="a.title"></JaxMath>
              </div>
              <div v-if="a.tSubject === 5 || a.tSubject === 4" class="subject-options">
                <div class="zg">
                  <div v-if="showUpload" class="jc-pic">
                    <!-- :disabled="a.stuAnswer && a.stuAnswer.length > 0" -->
                    <van-field
                      v-model.trim="a.textAnswer"
                      rows="4"
                      disabled
                      label=""
                      type="textarea"
                      placeholder="请填写答案"
                      @input="onSonTextAnswer"
                    />
                    <div class="jc-pic-upload">
                      <img v-if="a.stuAnswer" :src="a.stuAnswer" class="avatar" @click.native="previewImg(a.stuAnswer)" />
                      <van-icon v-else name="plus" size="2rem" />
                      <van-icon v-show="a.stuAnswer" name="cross" class="avatar-close-icon" size="1.5rem" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="son-subject-options">
                <div v-for="(e, f) in a.answerList" :key="f" class="option-item">
                  <!-- <span :class="e.checked ? 'hasCheck' : 'unCheck'"></span> -->
                  <span v-if="e.checked && e.isCorrect == 2" class="unCheck hasCheck-right"></span>
                  <span v-else-if="e.checked && e.isCorrect == 1" class="unCheck hasCheck-wrong"></span>
                  <span v-else class="unCheck"></span>
                  {{ e.aOption }}.<JaxMath :data="e.aText"></JaxMath>
                </div>
              </div>
              <div v-if="a.tSubject != 4 && a.tSubject != 5" class="your-answer">
                你的答案：<span>{{ a.stuAnswer ? a.stuAnswer : '未答' }}</span>
              </div>
              <div class="correct-answer">正确答案：{{ a.correctAnswer ? a.correctAnswer : '无' }}</div>
              <div v-if="a.isShow == 1" class="correct-analyse">题目解析：<JaxMath :data="a.analyse"></JaxMath></div>
            </div>
          </div>
        </div>
        <!-- :class="i.checked ? 'bgc' : ''" -->
        <div class="subject-options">
          <div v-for="(i, j) in item.answerList" :key="j" class="option-item">
            <span v-if="i.checked && i.isCorrect == 2" class="unCheck hasCheck-right"></span>
            <span v-else-if="i.checked && i.isCorrect == 1" class="unCheck hasCheck-wrong"></span>
            <span v-else class="unCheck"></span>
            {{ i.aOption }}.<JaxMath :data="i.aText"></JaxMath>
          </div>
        </div>
        <div v-if="item.tSubject != 11 && item.tSubject != 4 && item.tSubject != 5" class="your-answer">
          你的答案：<span>{{ item.stuAnswer ? item.stuAnswer : '未答' }}</span>
        </div>
        <div v-if="item.tSubject != 11" class="correct-answer">正确答案：{{ item.correctAnswer ? item.correctAnswer : '无' }}</div>
        <div v-if="item.isShow == 1 && item.tSubject != 11" class="correct-analyse">题目解析：<JaxMath :data="item.analyse"></JaxMath></div>
      </div>
    </div>
    <div class="footer van-hairline--top">
      <!-- <van-button v-if="isErrorBank == 0" class="join-btn" type="primary" size="large" round @click.native="next">下一题</van-button> -->
      <div class="btn-container">
        <!-- class="btn-container" -->
        <van-button class="next-btn" size="large" round @click.native="pre">上一题</van-button>
        <van-button class="next-btn" size="large" round @click.native="next">{{ idx === question.length - 1 ? '答题卡' : '下一题' }}</van-button>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

import { Dialog } from 'vant'
import { Toast } from 'vant'
import { ImagePreview } from 'vant'
import { querySubmitBankResult } from '@/api/bookTest'
import JaxMath from '@/components/JaxMath'
import Nav from '@/components/Nav'
import wx from 'jweixin-1.6.0'
import { uploadImage } from '@/api/exam'

export default {
  components: {
    Nav,
    JaxMath
  },
  data() {
    return {
      uid: this.$route.query.uid,
      subjectUserId: this.$route.query.subjectUserId,
      title: this.$route.query.title,
      showUpload: true,
      show: false, // 提交弹窗
      dtBookId: this.$route.query.dtBookId,
      chapterNodeId: this.$route.query.chapterNodeId,
      pointId: this.$route.query.pointId,
      versionCode: this.$route.query.versionCode,
      question: [
        // {
        //   id: 64635,
        //   bankId: 64635,
        //   title:
        //     '<span style="font-size:12pt"><span style="background-color:white"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;"><span style="color:#333333"><strong>Part B </strong></span></span></span></span><br />\n<span style="font-size:12pt"><span style="background-color:white"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;"><span style="color:#333333"><strong>Directions: </strong></span></span></span></span>\n<p style="text-align:justify"><span style="font-size:10.5pt"><span style="font-family:等线"><span style="font-size:12.0pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">Read the following text and answer the questions by choosing the most suitable subtitle from the list A-G for each numbered paragraph (41-45). There are two extra subtitles which you do not need to use. Mark your answers on ANSWER SHEET1. (10 points)</span></span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:10.5pt"><span style="font-family:等线"><span style="font-size:12.0pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">[A] Make It a Habit</span></span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:10.5pt"><span style="font-family:等线"><span style="font-size:12.0pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">[B] Don&rsquo;t Go It Alone</span></span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:10.5pt"><span style="font-family:等线"><span style="font-size:12.0pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">[C] Start Low, Go Slow</span></span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:10.5pt"><span style="font-family:等线"><span style="font-size:12.0pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">[D] Talk With Your Doctor</span></span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:10.5pt"><span style="font-family:等线"><span style="font-size:12.0pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">[E] Listen to Your Body</span></span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:10.5pt"><span style="font-family:等线"><span style="font-size:12.0pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">[F] Go Through the Motions</span></span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:10.5pt"><span style="font-family:等线"><span style="font-size:12.0pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">[G] Round Out Your Routine</span></span></span></span><br />\n&nbsp;</p>\n\n<p style="text-align:center"><span style="font-size:10.5pt"><span style="font-family:等线"><strong><span style="font-size:12.0pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">How to Get Active Again</span></span></strong></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:10.5pt"><span style="font-family:等线"><span style="font-size:12.0pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">&nbsp; &nbsp; Getting back into exercise after a break can be a challenge in the best of times, but with gyms and in-person exercise classes off-limits to many people these days, it can be tricky to know where to start. And it is important to get the right dose of activity. &ldquo;Too much too soon either results in injury or burnout,&rdquo; says Mary Yoke, PhD, a faculty member in the kinesiology department at Indiana University in Bloomington. The following simple strategies will help you return to exercise safely after a break.</span></span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:10.5pt"><span style="font-family:等线"><span style="font-size:12.0pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">&nbsp; &nbsp; 41. ________________</span></span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:10.5pt"><span style="font-family:等线"><span style="font-size:12.0pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">&nbsp; &nbsp; Don&rsquo;t try to go back to what you were doing before your break. If you were walking 3 miles a day, playing 18 holes of golf three times a week, or lifting 10-pound dumbbells for three sets of 10 reps, reduce activity to half a mile every other day, or nine holes of golf once a week with short walks on other days, or use 5-pound dumbbells for one set of 10 reps. Increase time, distance, and intensity gradually. &ldquo;This isn&rsquo;t something you can do overnight,&rdquo; says Keri L. Denay, MD, lead author of a recent American College of Sports Medicine advisory that encourages Americans to not overlook the benefits of activity during the pandemic. But you&rsquo;ll reap benefits such as less anxiety and improved sleep right away.</span></span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:10.5pt"><span style="font-family:等线"><span style="font-size:12.0pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">&nbsp; &nbsp; 42. ________________</span></span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:10.5pt"><span style="font-family:等线"><span style="font-size:12.0pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">&nbsp; &nbsp; If you&rsquo;re breathing too hard to talk in complete sentences, back off. If you feel good, go a little longer or faster. Feeling wiped out after a session? Go easier next time. And stay alert to serious symptoms, such as chest pain or pressure, severe shortness of breath or dizziness, or faintness, and seek medical attention immediately.</span></span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:10.5pt"><span style="font-family:等线"><span style="font-size:12.0pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">&nbsp; &nbsp; 43. ________________</span></span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:10.5pt"><span style="font-family:等线"><span style="font-size:12.0pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">&nbsp; &nbsp; Consistency is the key to getting stronger and building endurance and stamina. Ten minutes of activity per day is a good start says Marcus Jackovitz, DPT, a physical therapist at the University of Miami Hospital. All the experts we spoke with highly recommend walking because it&rsquo;s the easiest, most accessible form of exercise. Although it can be a workout on its own, if your goal is to get back to Zumba classes, tennis, cycling or any other activity, walking is also a great first step.</span></span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:10.5pt"><span style="font-family:等线"><span style="font-size:12.0pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">&nbsp; &nbsp; 44. ________________</span></span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:10.5pt"><span style="font-family:等线"><span style="font-size:12.0pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">&nbsp; &nbsp; Even if you can&rsquo;t yet do a favorite activity, you can practice the moves. With or without a club or racket, swing like you&rsquo;re hitting the ball. Paddle like you&rsquo;re in a kayak or canoe. Mimic your favorite swimming strokes. The action will remind you of the joy the activity brought you and prime your muscles for when you can get out there again.</span></span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:10.5pt"><span style="font-family:等线"><span style="font-size:12.0pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">&nbsp; &nbsp; 45. ________________</span></span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:10.5pt"><span style="font-family:等线"><span style="font-size:12.0pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">&nbsp; &nbsp; Exercising with others &ldquo;can keep you accountable and make it more fun, so you&rsquo;re more likely to do it again,&rdquo; Jackovitz says. You can do activities such as golf and tennis or take a walk with others and still be socially distant. But when you can&rsquo;t connect in person, consider using technology. Chat on the phone with a friend while you walk around your neighborhood. FaceTime with a relative as you strength train or stretch at home. You can also join a livestream or on-demand exercise class.</span></span></span></span></p>\n',
        //   briefTitle:
        //     'Part B \nDirections: \nRead the following text and answer the questions by choosing the most suitable subtitle from the list A-G for each numbered paragraph (41-45). There are two extra subtitles which you do not need to use. Mark your answers on ANSWER SHEET1. (10 points)\n\n[A] Make It a Habit\n\n[B] Don’t Go It Alone\n\n[C] Start Low, Go Slow\n\n[D] Talk With Your Doctor\n\n[E] Listen to Your Body\n\n[F] Go Through the Motions\n\n[G] Round Out Your Routine\n \n\nHow to Get Active Again\n\n    Getting back into exercise after a break can be a challenge in the best of times, but with gyms and in-person exercise classes off-limits to many people these days, it can be tricky to know where to start. And it is important to get the right dose of activity. “Too much too soon either results in injury or burnout,” says Mary Yoke, PhD, a faculty member in the kinesiology department at Indiana University in Bloomington. The following simple strategies will help you return to exercise safely after a break.\n\n    41. ________________\n\n    Don’t try to go back to what you were doing before your break. If you were walking 3 miles a day, playing 18 holes of golf three times a week, or lifting 10-pound dumbbells for three sets of 10 reps, reduce activity to half a mile every other day, or nine holes of golf once a week with short walks on other days, or use 5-pound dumbbells for one set of 10 reps. Increase time, distance, and intensity gradually. “This isn’t something you can do overnight,” says Keri L. Denay, MD, lead author of a recent American College of Sports Medicine advisory that encourages Americans to not overlook the benefits of activity during the pandemic. But you’ll reap benefits such as less anxiety and improved sleep right away.\n\n    42. ________________\n\n    If you’re breathing too hard to talk in complete sentences, back off. If you feel good, go a little longer or faster. Feeling wiped out after a session? Go easier next time. And stay alert to serious symptoms, such as chest pain or pressure, severe shortness of breath or dizziness, or faintness, and seek medical attention immediately.\n\n    43. ________________\n\n    Consistency is the key to getting stronger and building endurance and stamina. Ten minutes of activity per day is a good start says Marcus Jackovitz, DPT, a physical therapist at the University of Miami Hospital. All the experts we spoke with highly recommend walking because it’s the easiest, most accessible form of exercise. Although it can be a workout on its own, if your goal is to get back to Zumba classes, tennis, cycling or any other activity, walking is also a great first step.\n\n    44. ________________\n\n    Even if you can’t yet do a favorite activity, you can practice the moves. With or without a club or racket, swing like you’re hitting the ball. Paddle like you’re in a kayak or canoe. Mimic your favorite swimming strokes. The action will remind you of the joy the activity brought you and prime your muscles for when you can get out there again.\n\n    45. ________________\n\n    Exercising with others “can keep you accountable and make it more fun, so you’re more likely to do it again,” Jackovitz says. You can do activities such as golf and tennis or take a walk with others and still be socially distant. But when you can’t connect in person, consider using technology. Chat on the phone with a friend while you walk around your neighborhood. FaceTime with a relative as you strength train or stretch at home. You can also join a livestream or on-demand exercise class.\n',
        //   tSubject: 11,
        //   analyse: '',
        //   correctAnswer: '',
        //   isShow: 1,
        //   answerList: [],
        //   sonSubList: [
        //     {
        //       id: 64636,
        //       bankId: 64636,
        //       title: '41.',
        //       briefTitle: '41.',
        //       tSubject: 4,
        //       analyse:
        //         '<p style="text-align:justify">【答案】C</p>\n\n<p style="text-align:justify">【解析】第二段先指出不要试图恢复中断之前的运动水平，随后列举具体运动案例，明确如何减少运动量，并总结指出应循序渐进地增加运动强度、时间和距离，C项&ldquo;低起步，慢慢来&rdquo;与该段主旨相符，其中Start low与段中reduce activity 语义相关，Go Slow对应Increase &hellip; gradually。</p>\n',
        //       correctAnswer: 'C',
        //       isShow: 1,
        //       answerList: [],
        //       status: 0,
        //       stuAnswer: ''
        //     },
        //     {
        //       id: 64637,
        //       bankId: 64637,
        //       title: '42.',
        //       briefTitle: '42.',
        //       tSubject: 4,
        //       analyse:
        //         '<p style="text-align:justify">【答案】E</p>\n\n<p style="text-align:justify">【解析】第三段围绕运动者的身体反应提出建议：如果喘得太厉害，就停下来；如果没有不良反应，就可以多运动一会儿；并对一些严重的症状保持警惕，如果不适的症状过于明显，那么需要立即寻求治疗。可见，第三段建议运动者时刻关注自己的身体状况，运动时要根据身体的不同反应来调整运动量，E项&ldquo;倾听身体的声音&rdquo;准确概括该段主旨，其中Listen to与段中stay alert to近义，段中的breathing、feel、Feeling、symptoms等是your body的具体体现。</p>\n',
        //       correctAnswer: 'E',
        //       isShow: 1,
        //       answerList: [],
        //       status: 0,
        //       stuAnswer: ''
        //     },
        //     {
        //       id: 64638,
        //       bankId: 64638,
        //       title: '43.',
        //       briefTitle: '43.',
        //       tSubject: 4,
        //       analyse:
        //         '<p style="text-align:justify">【答案】A</p>\n\n<p style="text-align:justify">【解析】第四段首先点明坚持不懈是增强体力、耐力和毅力的关键因素，随后提出具体可行的建议&ldquo;每天步行十分钟&rdquo;并说明原因。由此可见，第四段强调运动不在时长和强度，而在于每天的坚持，也就是说要将运动变成每天的习惯。A项契合本段段意，故正确，</p>\n',
        //       correctAnswer: 'A',
        //       isShow: 1,
        //       answerList: [],
        //       status: 0,
        //       stuAnswer: ''
        //     },
        //     {
        //       id: 64639,
        //       bankId: 64639,
        //       title: '44.',
        //       briefTitle: '44.',
        //       tSubject: 4,
        //       analyse:
        //         '<p style="text-align:justify">【答案】F</p>\n\n<p style="text-align:justify">【解析】第五段观点鲜明，呈&ldquo;总&mdash;&mdash;分&rdquo;的论证模式，围绕&ldquo;练习动作&rdquo;这一中心话题展开。首句先引出中心话题&ldquo;练习动作&rdquo;，随后以击球、划船、游泳等运动为例，具体解释如何在不具备相关器械或条件的情况下练习动作，末句指出练习动作的益处。F项&ldquo;练习动作&rdquo;精确概括本段段意，其中，Go Through近义复现段中的practice，Motions近义复现段中的moves。</p>\n',
        //       correctAnswer: 'F',
        //       isShow: 1,
        //       answerList: [],
        //       status: 0,
        //       stuAnswer: ''
        //     },
        //     {
        //       id: 64640,
        //       bankId: 64640,
        //       title: '45.',
        //       briefTitle: '45.',
        //       tSubject: 4,
        //       analyse:
        //         '<p style="text-align:justify">【答案】B</p>\n\n<p style="text-align:justify">【解析】第六段首先指出与他人一起锻炼有益处：让人约束自己，增加运动的乐趣，从而促使运动者再次运动。随后探讨了疫情背景下的两种选择：选择高尔夫、网球、步行等可保持社交距离的运动；充分利用网络技术，在独自运动时与家人朋友交流，或是参与线上课程与他人实时起锻炼。B项&ldquo;不要单独行动&rdquo;是对这些建议的准确概括，Don&rsquo;t Go It Alone近义复现段中Exercising with others</p>\n',
        //       correctAnswer: 'B',
        //       isShow: 1,
        //       answerList: [],
        //       status: 0,
        //       stuAnswer: ''
        //     }
        //   ],
        //   status: 1
        // },
        // {
        //   id: 64581,
        //   bankId: 64581,
        //   title:
        //     '<strong><span style="font-size:12pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">Part B </span></span><br />\n<span style="font-size:12pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">Directions:</span></span></strong>\n<p style="text-align:justify"><span style="font-size:11.5pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;"><span style="font-size:12.0pt">Read the following text and answer the questions by choosing the most suitable subheading from the list A-G for each numbered paragraph (41-45). There are two extra subheadings which you do not need to use. Mark your answers on the ANSWER SHEET. (10 points)</span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:11pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;"><span style="font-size:12.0pt">[A] </span><span style="font-size:12.0pt">Stay calm.</span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:11pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;"><span style="font-size:12.0pt">[B] </span><span style="font-size:12.0pt">Stay humble.</span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:11pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;"><span style="font-size:12.0pt">[C] </span><span style="font-size:12.0pt">Decide whether to wait.</span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:11pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;"><span style="font-size:12.0pt">[D] </span><span style="font-size:12.0pt">Be realistic about the risks.</span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:11pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;"><span style="font-size:12.0pt">[E] </span><span style="font-size:12.0pt">Don&rsquo;t make judgements.</span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:11pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;"><span style="font-size:12.0pt">[F] </span><span style="font-size:12.0pt">Identify a shared goal.</span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:11pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;"><span style="font-size:12.0pt">[G] </span><span style="font-size:12.0pt">Ask permission to disagree.</span></span></span></p>\n\n<p style="text-align:justify">&nbsp;</p>\n\n<p style="text-align: center;"><strong><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;; font-size:12pt">How to disagree with someone more powerful than you</span></strong></p>\n\n<p style="text-align:justify"><span style="font-size:11.5pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;"><span style="font-size:12.0pt">&nbsp; &nbsp; Your boss proposes a new initiative you think won&rsquo;t work. Your senior colleague outlines a project timeline you believe is unrealistic. What do you say when you disagree with someone who has more power than you do? How do you decide whether it&rsquo;s worth speaking up? And if you do, what exactly should you say? Here&rsquo;s how to disagree with someone more powerful than you.</span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:11.5pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;"><span style="font-size:12.0pt">&nbsp; &nbsp; 41. __________________</span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:11.5pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;"><span style="font-size:12.0pt">&nbsp; &nbsp; You may decide it&rsquo;s best to hold off on voicing your opinion. Maybe you haven&rsquo;t finished thinking the problem through, or you want to get a clearer sense of what the group thinks. If you think other people are going to disagree, too, you might want to gather your army first. People can contribute experience or information to your thinking &mdash; all the things that would make the disagreement stronger or more valid. It&rsquo;s also a good idea to delay the conversation if you are in a meeting or other public space. Discussing the issue in private will make the powerful person feel less threatened.</span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:11.5pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;"><span style="font-size:12.0pt">&nbsp; &nbsp; 42. __________________</span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:11.5pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;"><span style="font-size:12.0pt">&nbsp; &nbsp; Before you share your thoughts, think about what the powerful person cares about &mdash; it may be the credibility of their team or getting a project done on time. You&rsquo;re more likely to be heard if you can connect your disagreement to a higher purpose. When you do speak up, don&rsquo;t assume the link will be clear. You&rsquo;ll want to state it overtly, contextualizing your statements so that you&rsquo;re seen not as a disagreeable subordinate but as a colleague who&rsquo;s trying to advance a common objective. The discussion will then become more like a chess game than a boxing match.</span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:11.5pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;"><span style="font-size:12.0pt">&nbsp; &nbsp; 43.</span><span style="font-size:12.0pt"> __________________</span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:11.5pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;"><span style="font-size:12.0pt">&nbsp; &nbsp; This step may sound overly deferential, but it&rsquo;s a smart way to give the powerful person psychological safety and control. You can say something like, &ldquo;I know we seem to be moving toward a first-quarter commitment here. I have reasons to think that won&rsquo;t work. I&rsquo;d like to lay out my reasoning. Would that be OK?&rdquo; This gives the person a choice, allowing him to verbally opt in. And, assuming he says yes, it will make you feel more confident about voicing your disagreement.</span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:11pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;"><span style="font-size:12.0pt">&nbsp; &nbsp; 44. __________________</span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:11.5pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;"><span style="font-size:12.0pt">&nbsp; &nbsp; You might feel your heart racing or your face turning red, but do whatever you can to remain neutral in both your words and actions. When your body language communicates reluctance or anxiety, it undercuts the message. It sends a mixed message, and your counterpart gets to choose what signals to read. Deep breaths can help, as can speaking more slowly and deliberately. When we feel panicky, we tend to talk louder and faster. Simply slowing the pace and talking in an even tone helps the other person cool down and does the same for you. It also makes you seem confident, even if you aren&rsquo;t.</span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:11.5pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;"><span style="font-size:12.0pt">&nbsp; &nbsp; 45.</span><span style="font-size:12.0pt"> __________________<br />\n&nbsp; &nbsp;&nbsp;</span></span></span><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;; font-size:12pt">Emphasize that you&rsquo;re only offering your opinion, not gospel truth. It may be a well-informed, well-researched opinion, but it&rsquo;s still an opinion, so talk tentatively and slightly understate your confidence. Instead of saying: &ldquo;If we set an end-of-quarter deadline, we will never make it,&rdquo; say, &ldquo;This is just my opinion, but I don&rsquo;t see how we will make that deadline.&rdquo; Having asserted your opinion (as a position, not as a fact), demonstrate equal curiosity about other views. Remind the person that this is your point of view, and then invite critique. Be open to hearing other opinions.</span></p>\n',
        //   briefTitle:
        //     'Part B \nDirections:\nRead the following text and answer the questions by choosing the most suitable subheading from the list A-G for each numbered paragraph (41-45). There are two extra subheadings which you do not need to use. Mark your answers on the ANSWER SHEET. (10 points)\n\n[A] Stay calm.\n\n[B] Stay humble.\n\n[C] Decide whether to wait.\n\n[D] Be realistic about the risks.\n\n[E] Don’t make judgements.\n\n[F] Identify a shared goal.\n\n[G] Ask permission to disagree.\n\n \n\nHow to disagree with someone more powerful than you\n\n    Your boss proposes a new initiative you think won’t work. Your senior colleague outlines a project timeline you believe is unrealistic. What do you say when you disagree with someone who has more power than you do? How do you decide whether it’s worth speaking up? And if you do, what exactly should you say? Here’s how to disagree with someone more powerful than you.\n\n    41. __________________\n\n    You may decide it’s best to hold off on voicing your opinion. Maybe you haven’t finished thinking the problem through, or you want to get a clearer sense of what the group thinks. If you think other people are going to disagree, too, you might want to gather your army first. People can contribute experience or information to your thinking — all the things that would make the disagreement stronger or more valid. It’s also a good idea to delay the conversation if you are in a meeting or other public space. Discussing the issue in private will make the powerful person feel less threatened.\n\n    42. __________________\n\n    Before you share your thoughts, think about what the powerful person cares about — it may be the credibility of their team or getting a project done on time. You’re more likely to be heard if you can connect your disagreement to a higher purpose. When you do speak up, don’t assume the link will be clear. You’ll want to state it overtly, contextualizing your statements so that you’re seen not as a disagreeable subordinate but as a colleague who’s trying to advance a common objective. The discussion will then become more like a chess game than a boxing match.\n\n    43. __________________\n\n    This step may sound overly deferential, but it’s a smart way to give the powerful person psychological safety and control. You can say something like, “I know we seem to be moving toward a first-quarter commitment here. I have reasons to think that won’t work. I’d like to lay out my reasoning. Would that be OK?” This gives the person a choice, allowing him to verbally opt in. And, assuming he says yes, it will make you feel more confident about voicing your disagreement.\n\n    44. __________________\n\n    You might feel your heart racing or your face turning red, but do whatever you can to remain neutral in both your words and actions. When your body language communicates reluctance or anxiety, it undercuts the message. It sends a mixed message, and your counterpart gets to choose what signals to read. Deep breaths can help, as can speaking more slowly and deliberately. When we feel panicky, we tend to talk louder and faster. Simply slowing the pace and talking in an even tone helps the other person cool down and does the same for you. It also makes you seem confident, even if you aren’t.\n\n    45. __________________\n    Emphasize that you’re only offering your opinion, not gospel truth. It may be a well-informed, well-researched opinion, but it’s still an opinion, so talk tentatively and slightly understate your confidence. Instead of saying: “If we set an end-of-quarter deadline, we will never make it,” say, “This is just my opinion, but I don’t see how we will make that deadline.” Having asserted your opinion (as a position, not as a fact), demonstrate equal curiosity about other views. Remind the person that this is your point of view, and then invite critique. Be open to hearing other opinions.\n',
        //   tSubject: 11,
        //   analyse: '<strong>长难句分析<br />\n<img alt="" src="https://test.guangyiedu.com/ckeditor/1661240345330.png" /></strong>',
        //   correctAnswer: '',
        //   isShow: 1,
        //   answerList: [],
        //   sonSubList: [
        //     {
        //       id: 64582,
        //       bankId: 64582,
        //       title: '41.',
        //       briefTitle: '41.',
        //       tSubject: 4,
        //       analyse:
        //         '<p style="text-align:justify">【答案】C</p>\n\n<p style="text-align:justify">【解析】第二段指出，如果还未充分考虑与上司产生争议的这一问题，或想要先了解同事的看法，或正身处会议室等公共场合，那么最好暂缓提反对意见，即要等待提异议的合适时机或场合，C项&ldquo;决定是否再等等&rdquo;与该段主旨相符，其中Decide原词复现首句(You may) decide，wait近义复现首句hold off on和第五句delay。</p>\n',
        //       correctAnswer: 'C',
        //       isShow: 1,
        //       answerList: [],
        //       status: 0,
        //       stuAnswer: ''
        //     },
        //     {
        //       id: 64583,
        //       bankId: 64583,
        //       title: '42.',
        //       briefTitle: '42.',
        //       tSubject: 4,
        //       analyse:
        //         '<p style="text-align:justify">【答案】F</p>\n\n<p style="text-align:justify">【解析】第三段针对进言之前的准备工作、进言之时的谈吐提建议，指出需要先了解上司关注的目标，后将这一目标与个人异议相结合，并在进言之时直白地挑明这两者的关联，以向上司证明你是一个努力推进共同目标的同事，F项&ldquo;确定共同目标&rdquo;契合本段主旨。</p>\n',
        //       correctAnswer: 'F',
        //       isShow: 1,
        //       answerList: [],
        //       status: 0,
        //       stuAnswer: ''
        //     },
        //     {
        //       id: 64584,
        //       bankId: 64584,
        //       title: '43.',
        //       briefTitle: '43.',
        //       tSubject: 4,
        //       analyse:
        //         '<p style="text-align:justify">【答案】G</p>\n\n<p style="text-align:justify">【解析】第四段先评价&ldquo;这一做法（This step）&rdquo;：看似过于顺从，实则是卸下上司心理防卫的明智之举。后举例说明&ldquo;这一做法&rdquo;：向上司请求表达异议的许可。最后指出该做法的作用：让上司更可能听取反对意见。综合可见，G项&ldquo;请求允许表达异议&rdquo;与该段主旨一致，其中Ask permission与第五句Would that be OK的请求之意相符。</p>\n',
        //       correctAnswer: 'G',
        //       isShow: 1,
        //       answerList: [],
        //       status: 0,
        //       stuAnswer: ''
        //     },
        //     {
        //       id: 64585,
        //       bankId: 64585,
        //       title: '44.',
        //       briefTitle: '44.',
        //       tSubject: 4,
        //       analyse:
        //         '<p style="text-align:justify">【答案】A</p>\n\n<p style="text-align:justify">【解析】第五段先指出向上司提异议时要尽力保持不动声色，随后说明紧张等情绪对沟通效果的负面影响，并提出两条抚平情绪的建议：深呼吸、更缓慢更谨慎地讲话。可见本段主要建议读者保持镇静，避免负面情绪影响进言的成败，A项&ldquo;保持冷静&rdquo;契合本段主旨。</p>\n',
        //       correctAnswer: 'A',
        //       isShow: 1,
        //       answerList: [],
        //       status: 0,
        //       stuAnswer: ''
        //     },
        //     {
        //       id: 64586,
        //       bankId: 64586,
        //       title: '45.',
        //       briefTitle: '45.',
        //       tSubject: 4,
        //       analyse:
        //         '<p style="text-align:justify">【答案】B</p>\n\n<p style="text-align:justify">【解析】第六段先建议读者向上司强调自己仅是在提供&ldquo;个人观点&rdquo;而非&ldquo;绝对真理&rdquo;，后又提出要采用试探性的表达、收敛自信，最后指出要耐心倾听对方的意见甚至批评。B项&ldquo;保持谦逊（不要自视甚高）&rdquo;是对这些建议的准确概括，Stay humble近义复现第二句understate your confidence。</p>\n',
        //       correctAnswer: 'B',
        //       isShow: 1,
        //       answerList: [],
        //       status: 0,
        //       stuAnswer: ''
        //     }
        //   ],
        //   status: 1
        // },
        // {
        //   id: 64643,
        //   bankId: 64643,
        //   title:
        //     '<span style="font-size:12pt"><span style="background-color:white"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;"><span style="color:#333333"><strong>Part B</strong></span></span></span></span>\n<p style="text-align:justify"><span style="font-size:10.5pt"><span style="font-family:等线"><span style="font-size:12.0pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">48.<strong> Directions:</strong></span></span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:10.5pt"><span style="font-family:等线"><span style="font-size:12.0pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">Write an essay based on the chart below. In your writing, you should</span></span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:10.5pt"><span style="font-family:等线"><span style="font-size:12.0pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">1) interpret the chart and</span></span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:10.5pt"><span style="font-family:等线"><span style="font-size:12.0pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">2) give your comments</span></span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:10.5pt"><span style="font-family:等线"><span style="font-size:12.0pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">You should write about 150 words in the <strong>ANSWER SHEET.</strong> (15 points)<br />\n<img alt="" src="https://test.guangyiedu.com/ckeditor/1661413340331.png" /></span></span></span></span></p>\n',
        //   briefTitle:
        //     'Part B\n48. Directions:\n\nWrite an essay based on the chart below. In your writing, you should\n\n1) interpret the chart and\n\n2) give your comments\n\nYou should write about 150 words in the ANSWER SHEET. (15 points)\n\n',
        //   tSubject: 5,
        //   analyse:
        //     '<p style="text-align:justify">48．我国快递业务量变动情况</p>\n\n<p style="text-align:justify">【参考范文】</p>\n\n<p style="text-align:justify">&nbsp; &nbsp; According to the bar chart, the volume of express parcels across China surged from 51 billion pieces in 2018 to 83 billion pieces in 2020. When it comes to the rural areas, the trend is particularly striking, which doubled to 30 billion pieces in the last one year alone.</p>\n\n<p style="text-align:justify">&nbsp; &nbsp; This chart reveals the robust growth of China&rsquo;s express delivery sector. It is closely tied to the e-commerce boom. To be specific, as livestreaming e-commerce takes off amid the pandemic, people sheltered at home are more inclined to purchase online, thereby giving impetus to the delivery business. Moreover, the government has made sustained efforts to improve infrastructure in the countryside, which paves the way for the extension of courier services to the vast rural markets. Add to this the increased efficiency of logistics, and it is hardly surprising that the volume of express delivery should continue to soar in recent years.</p>\n\n<p style="text-align:justify">&nbsp; &nbsp; The burgeoning courier sector not only facilitates people&rsquo;s lives, but also provides a massive boost to the country&rsquo;s economy. More significantly, by opening up new employment opportunities for rural residents and promoting sales of agricultural produce, it makes a huge contribution to rural revitalization.</p>\n',
        //   correctAnswer: '',
        //   isShow: 1,
        //   answerList: [],
        //   status: 1,
        //   stuAnswer: '666'
        // },
        // {
        //   id: 64589,
        //   bankId: 64589,
        //   title:
        //     '<strong><span style="font-size:12pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;">Part B</span></span></strong>\n<p style="text-align:justify"><span style="font-size:11pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;"><span style="font-size:12.0pt">48. <strong>Directions:</strong></span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:11.5pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;"><span style="font-size:12.0pt">Write an essay based on the chart below. In your writing, you should</span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:11pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;"><span style="font-size:12.0pt">1) </span><span style="font-size:12.0pt">interpret the chart, and</span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:11pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;"><span style="font-size:12.0pt">2) </span><span style="font-size:12.0pt">give your comments.</span></span></span></p>\n\n<p style="text-align:justify"><span style="font-size:11.5pt"><span style="font-family:&quot;Times New Roman&quot;,&quot;serif&quot;"><span style="font-size:12.0pt">You should write about 150 words on the ANSWER SHEET. (15 points)<br />\n<img alt="" src="https://test.guangyiedu.com/ckeditor/1661240914673.png" /></span></span></span></p>\n',
        //   briefTitle:
        //     'Part B\n48. Directions:\n\nWrite an essay based on the chart below. In your writing, you should\n\n1) interpret the chart, and\n\n2) give your comments.\n\nYou should write about 150 words on the ANSWER SHEET. (15 points)\n\n',
        //   tSubject: 5,
        //   analyse:
        //     '<p style="text-align:justify">48．某市居民锻炼方式调查</p>\n\n<p style="text-align:justify">【参考范文】</p>\n\n<p style="text-align:justify">&nbsp; &nbsp; According to the chart, over half of the respondents get physical exercise by themselves, while 47.7% do so with friends and 23.9% with family members. By comparison, no more than 16% of those questioned play team sports.</p>\n\n<p style="text-align:justify">&nbsp; &nbsp; People prefer to take exercise alone rather than with someone else primarily on account of flexibility and convenience. In this way, they can, for example, go jogging anytime they want, without the need to make a plan with friends in advance. Furthermore, a wide range of fitness videos, apps and games have boosted the popularity of doing workouts alone at home. Another conclusion from the data is that people are much more likely to work out with friends than with family members. That may be because exercise is not a part of the whole family&rsquo;s daily routine, or simply because they live apart from their family.</p>\n\n<p style="text-align:justify">&nbsp; &nbsp; Taking exercise alone will be a growing trend in today&rsquo;s busy society where most people&rsquo;s schedules do not match. But it is advisable, if possible, to find a workout partner to keep you motivated.</p>\n',
        //   correctAnswer: '',
        //   isShow: 1,
        //   answerList: [],
        //   status: 1,
        //   stuAnswer: '999'
        // }
      ],
      unAnswerQuestion: [],
      isShow: -1,
      idx: 0,
      sonTextFocus: 0 // 小题输入框聚焦index
    }
  },
  mounted() {
    this.loadSubjects()
  },
  methods: {
    previewImg(url) {
      ImagePreview({
        images: [url],
        showIndex: false
      })
    },
    toAnswer() {
      this.$router.replace({
        path: '/dtTest',
        query: {
          dtBookId: this.dtBookId,
          chapterNodeId: this.chapterNodeId,
          pointId: this.pointId,
          versionCode: this.versionCode,
          // token: this.token,
          uid: this.uid
        }
      })
    },
    removePic() {
      this.question[this.idx].stuAnswer = ''
      this.showUpload = false
      this.$nextTick(() => {
        this.showUpload = true
      })
    },
    removeSonPic(b) {
      this.question[this.idx].sonSubList[b].stuAnswer = ''
      this.showUpload = false
      this.$nextTick(() => {
        this.showUpload = true
      })
    },
    onSonTextFocus(val) {
      this.sonTextFocus = val
    },
    onSonTextAnswer(val) {
      this.question[this.idx].sonSubList[this.sonTextFocus].stuAnswer = ''
      this.question[this.idx].sonSubList[this.sonTextFocus].textAnswer = val
    },
    onTextAnswer(val) {
      this.question[this.idx].stuAnswer = ''
      this.question[this.idx].textAnswer = val
    },
    toUploadSonAnswer(b) {
      const that = this
      wx.ready(() => {
        setTimeout(() => {
          // eslint-disable-next-line no-undef
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['camera', 'album'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              const localIds = res.localIds // 返回选定照片的本地 ID 列表，localId可以作为 img 标签的 src 属性显示图片
              // that.picUrl = localIds
              wx.getLocalImgData({
                localId: localIds[0], // 图片的localID
                success: function (res) {
                  let base64Data = ''
                  if (res.localData.indexOf(';base64,') === -1) {
                    // 兼容处理，安卓获取的图片base64码没有前缀，而苹果有,base64前缀并不固定
                    base64Data = 'data:image/jpeg;base64,' + res.localData
                  }
                  if (res.localData.indexOf('data:image/jpg;base64,') !== -1) {
                    // 兼容处理，若是苹果手机，将前缀中的jgp替换成jpeg
                    base64Data = res.localData.replace('data:image/jpg;base64,', 'data:image/jpeg;base64,')
                  }
                  const picFile = that.$base64toFile(base64Data)
                  const fd = new FormData()
                  fd.append('cosPath', 'gfkd/masterhead')
                  fd.append('file', picFile)
                  uploadImage(fd).then(result => {
                    if (result.code === 200) {
                      Toast({
                        message: '上传成功',
                        position: 'middle'
                      })
                      that.question[that.idx].sonSubList[b].stuAnswer = accessUrl
                      that.question[that.idx].sonSubList[b].textAnswer = ''
                      this.showUpload = false
                      this.$nextTick(() => {
                        this.showUpload = true
                      })
                    }
                  })
                }
              })
            }
          })
        }, 200)
      })
    },
    toUploadAnswer() {
      const that = this
      wx.ready(() => {
        setTimeout(() => {
          // eslint-disable-next-line no-undef
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['camera', 'album'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              const localIds = res.localIds // 返回选定照片的本地 ID 列表，localId可以作为 img 标签的 src 属性显示图片
              // that.picUrl = localIds
              wx.getLocalImgData({
                localId: localIds[0], // 图片的localID
                success: function (res) {
                  let base64Data = ''
                  if (res.localData.indexOf(';base64,') === -1) {
                    // 兼容处理，安卓获取的图片base64码没有前缀，而苹果有,base64前缀并不固定
                    base64Data = 'data:image/jpeg;base64,' + res.localData
                  }
                  if (res.localData.indexOf('data:image/jpg;base64,') !== -1) {
                    // 兼容处理，若是苹果手机，将前缀中的jgp替换成jpeg
                    base64Data = res.localData.replace('data:image/jpg;base64,', 'data:image/jpeg;base64,')
                  }
                  const picFile = that.$base64toFile(base64Data)
                  const fd = new FormData()
                  fd.append('cosPath', 'gfkd/masterhead')
                  fd.append('file', picFile)
                  uploadImage(fd).then(result => {
                    if (result.code === 200) {
                      Toast({
                        message: '上传成功',
                        position: 'middle'
                      })
                      that.question[that.idx].stuAnswer = result.data.accessUrl
                      that.question[that.idx].textAnswer = ''
                      // that.$set(that.question, that.idx, that.question[that.idx])
                    }
                  })
                }
              })
            }
          })
        }, 200)
      })
    },
    // 切换到指定题目
    changIdx(i) {
      this.idx = i.num - 1
      this.show = false
    },
    rightClick() {
      // this.question.forEach(item => {
      //   item.isUnAnswer = false
      //   if (item.tSubject !== 11) {
      //     if (!item.stuAnswer && !item.textAnswer) {
      //       item.isUnAnswer = true
      //     }
      //   }
      //   if (item.tSubject === 11) {
      //     const flag = item.sonSubList.some(i => !i.stuAnswer && !i.textAnswer)
      //     if (flag) {
      //       item.isUnAnswer = true
      //     }
      //   }
      // })
      this.show = true
    },
    pre() {
      if (this.idx == 0) {
        Toast({
          message: '已经是第一题',
          position: 'middle'
        })
        return
      }
      this.idx--
    },
    next() {
      if (this.idx === this.question.length - 1) {
        // 去提交
        this.show = true
        return
      }
      this.idx++
    },
    handleSonClick(info, idx, b) {
      const question = this.question[this.idx].sonSubList[b] // 每题选项
      const option = this.question[this.idx].sonSubList[b].answerList // 每一题题目的选项
      console.log(option)
      // 选中添加样式
      option.forEach((item, ix) => {
        if (ix === idx) {
          // 如果选中的与数据里面的相等就改变他的样式
          item.checked = !item.checked // 是否选中，取反
        } else if (question.tSubject !== 3) {
          // 如果不是多选 只能选中一个 其他的都为false
          item.checked = false
        }
      })

      let isAnswer = '' // 选中的答案
      if (info.checked) {
        isAnswer = info.aOption // 选中的答案
      }

      // 如果是多选
      if (question.tSubject === 3) {
        this.ismultipleAnswer = []
        option.forEach(item => {
          if (item.checked) {
            // 将选中的push到 ismultipleAnswer 数组中
            this.ismultipleAnswer.push(item.aOption)
          }
        })
        isAnswer = this.ismultipleAnswer.join(',')
      }

      // console.log("选中的答案", isAnswer);
      // console.log('题目的答案', answer)

      this.question[this.idx].sonSubList[b].stuAnswer = isAnswer
    },
    handleClick(info, idx) {
      const question = this.question[this.idx] // 每题选项
      const option = this.question[this.idx].answerList // 每一题题目的选项

      // 选中添加样式
      option.forEach((item, ix) => {
        if (ix === idx) {
          // 如果选中的与数据里面的相等就改变他的样式
          item.checked = !item.checked // 是否选中，取反
        } else if (question.tSubject !== 3) {
          // 如果不是多选 只能选中一个 其他的都为false
          item.checked = false
        }
      })

      let isAnswer = '' // 选中的答案
      if (info.checked) {
        isAnswer = info.aOption // 选中的答案
      }

      // 如果是多选
      if (question.tSubject === 3) {
        this.ismultipleAnswer = []
        option.forEach(item => {
          if (item.checked) {
            // 将选中的push到 ismultipleAnswer 数组中
            this.ismultipleAnswer.push(item.aOption)
          }
        })
        isAnswer = this.ismultipleAnswer.join(',')
      }

      console.log('选中的答案', isAnswer)
      // console.log('题目的答案', answer)
      this.question[this.idx].stuAnswer = isAnswer // 记录学生答案
      // 缓存作答记录
      // Storage.setExamRecord(`contest-${this.examId}`, this.question)
    },
    isUrl(str) {
      return /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i.test(str)
    },
    // 加载题目列表
    loadSubjects() {
      // this.question.forEach((i, index) => {
      //   i.isUnAnswer = false
      //   if (i.tSubject !== 11) {
      //     if (!i.stuAnswer && !i.textAnswer) {
      //       i.isUnAnswer = true
      //     }
      //   }
      //   if (i.tSubject === 11) {
      //     const flag = i.sonSubList.some(k => !k.stuAnswer && !k.textAnswer)
      //     if (flag) {
      //       i.isUnAnswer = true
      //     }
      //   }
      //   i.num = index + 1
      //   if (i.tSubject == 4 || i.tSubject == 5) {
      //     if (this.isUrl(i.stuAnswer)) {
      //       i.stuAnswer = i.stuAnswer
      //     } else {
      //       i.textAnswer = i.stuAnswer
      //       i.stuAnswer = ''
      //     }
      //   }
      //   if (i.tSubject == 11 && i.sonSubList.length > 0) {
      //     i.sonSubList.forEach((j, k) => {
      //       if (j.tSubject == 4 || j.tSubject == 5) {
      //         if (this.isUrl(j.stuAnswer)) {
      //           j.stuAnswer = j.stuAnswer
      //         } else {
      //           j.textAnswer = j.stuAnswer
      //           j.stuAnswer = ''
      //         }
      //       }
      //     })
      //   }
      // })
      // this.question = this.question
      // --------------------------------------------
      const data = {}
      data.subjectUserId = this.subjectUserId
      // data.uid = this.uid
      querySubmitBankResult(data).then(res => {
        if (res.code === 200) {
          res.data.forEach((i, index) => {
            i.isUnAnswer = false
            if (i.tSubject !== 11) {
              if (!i.stuAnswer && !i.textAnswer) {
                i.isUnAnswer = true
              }
            }
            if (i.tSubject === 11) {
              const flag = i.sonSubList.some(k => !k.stuAnswer && !k.textAnswer)
              if (flag) {
                i.isUnAnswer = true
              }
            }
            i.num = index + 1
            if (i.tSubject == 4 || i.tSubject == 5) {
              if (this.isUrl(i.stuAnswer)) {
                i.stuAnswer = i.stuAnswer
              } else {
                i.textAnswer = i.stuAnswer
                i.stuAnswer = ''
              }
            }
            if (i.tSubject == 11 && i.sonSubList.length > 0) {
              i.sonSubList.forEach((j, k) => {
                if (j.tSubject == 4 || j.tSubject == 5) {
                  if (this.isUrl(j.stuAnswer)) {
                    j.stuAnswer = j.stuAnswer
                  } else {
                    j.textAnswer = j.stuAnswer
                    j.stuAnswer = ''
                  }
                }
              })
            }
          })
          this.question = res.data
        } else {
          // this.isShow = ret.data.isShow
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dt-test {
  user-select: none;
  -moz-user-select: none; /* Firefox私有属性 */
  -webkit-user-select: none; /* WebKit内核私有属性 */
  -ms-user-select: none; /* IE私有属性(IE10及以后) */
  -khtml-user-select: none; /* Khtml内核私有属性 */
  -o-user-select: none; /* Opera私有属性 */
  // height: 100%;
  width: 100%;
  position: relative;
  background-color: #fff;
  /deep/ .van-popup--bottom {
    padding-top: 30px;
  }
  .contest-popup {
    .contest-popup-toolBar {
      color: #666;
      height: 60px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      // margin-bottom: 20px;
      .text-l {
        color: #333;
      }

      .text-r {
        // float: right;
        display: flex;
        align-items: center;
        .answered {
          // float: right;
        }

        .unAnswer {
          // float: right;
        }
      }
    }
    .option-container {
      height: 870px;
      overflow-y: scroll;
      padding-bottom: 10px;
      .contest-popup-danxuan {
        height: 60px;
        padding: 0 20px;
        display: flex;
        align-items: center;
      }
      .contest-popup-danxuan-list {
        padding: 0 20px;
        width: 100%;
        // background-color: ;
        display: flex;
        // justify-content: space-between;
        flex-wrap: wrap;
        .list-item {
          width: 20%;
          height: 100px;
          margin-bottom: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          .item {
            width: 90px;
            height: 90px;
            border: 1px solid #aaa;
            color: #333;
            border-radius: 50%;
            text-align: center;
            line-height: 90px;
          }

          .answered-bgc {
            color: #00a400;
            border: 1px solid #00a400;
            background: rgba(0, 164, 0, 0.17);
          }
        }
      }
    }
    .commit {
      padding: 0 20px;
      .commit-btn {
        height: 85px;
        background-color: #10c4ee;
        color: white;
      }
    }
  }
  .dt-test-subjects {
    width: 100%;
    // height: calc(100% - 180px);
    min-height: 1200px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 20px 28px 100px 28px;
    .subject-type {
      margin-bottom: 25px;
      .subject-type-item {
        border: 1px solid #2ba1f4;
        color: #2ba1f4;
        font-weight: normal;
        padding: 2px 5px;
        // font-size: 14px;
        border-radius: 10px;
      }
    }
    .subject-title {
      margin-bottom: 60px;
      white-space: wrap;
      .mymath {
        display: block;
        .mjx-chtml {
          white-space: wrap;
          word-wrap: break-word;
          word-break: break-all;
        }
      }
    }
    .subject-options {
      .option-item {
        display: flex;
        align-items: center;
        margin-bottom: 40px;
        min-height: 90px;
        .unCheck {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid #ccc;
          margin-right: 10px;
        }
        .hasCheck {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid #49cb10;
          margin-right: 10px;
          background-color: #49cb10;
        }
        .hasCheck-right {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid #49cb10;
          margin-right: 5px;
          background-color: #49cb10;
        }
        .hasCheck-wrong {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid #ff3f13;
          margin-right: 5px;
          background-color: #ff3f13;
        }
      }
      .zg {
        .jc-pic {
          border: 1px solid #d9d9d9;
          border-radius: 6px;
          padding-left: 2px;
          margin-top: 10px;
          position: relative;
          .jc-pic-upload {
            width: 200px;
            height: 200px;
            margin-top: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid #ccc;
            position: relative;
            .avatar-add-icon {
              position: absolute;
              right: -25px;
              top: 0;
            }
            .avatar-close-icon {
              position: absolute;
              right: -40px;
              top: -15px;
              color: #ccc;
            }
          }
          // /deep/ .el-textarea__inner {
          //   border: none;
          // }
          // /deep/ .avatar-uploader .el-upload {
          //   border: 1px dashed #d9d9d9;
          //   border-radius: 6px;
          //   cursor: pointer;
          //   position: relative;
          //   overflow: hidden;
          // }
          // /deep/ .avatar-uploader .el-upload:hover {
          //   border-color: #409eff;
          // }
          // /deep/ .avatar-uploader-icon {
          //   font-size: 28px;
          //   color: #8c939d;
          //   width: 100px;
          //   height: 100px;
          //   line-height: 100px;
          //   text-align: center;
          // }
          // .avatar-close-icon {
          //   position: absolute;
          //   left: 102px;
          //   bottom: 98px;
          // }
          .avatar {
            width: 200px;
            height: 200px;
            display: block;
          }
        }
      }
      .zh {
        // 组合题
        height: 400px;
        // border: 1px solid #000;
        overflow-y: auto;
        overflow-x: auto;
        padding-left: 20px;
        .son-subject-title {
          margin-bottom: 15px;
        }

        .son-subject-options {
          .option-item {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            min-height: 60px;
            .unCheck {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              border: 1px solid #ccc;
              margin-right: 5px;
            }
            .hasCheck {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              border: 1px solid #49cb10;
              margin-right: 5px;
              background-color: #49cb10;
            }
            .hasCheck-right {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              border: 1px solid #49cb10;
              margin-right: 5px;
              background-color: #49cb10;
            }
            .hasCheck-wrong {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              border: 1px solid #ff3f13;
              margin-right: 5px;
              background-color: #ff3f13;
            }
          }
        }
      }
    }
    .your-answer {
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .correct-answer {
      margin-top: 20px;
      margin-bottom: 20px;
    }
    .correct-analyse {
    }
  }
  .footer {
    width: 100%;
    position: fixed;
    height: 100px;
    bottom: 0;
    background-color: #fff;
    z-index: 999;
    padding: 0 28px;
    // .join-btn {
    //   height: 90px;
    //   background-color: #2cad69;
    // }
    .btn-container {
      display: flex;
      justify-content: space-between;
      .next-btn {
        width: 49%;
        height: 90px;
        background-color: #10c4ee;
        color: white;
      }
    }
  }
}
</style>
